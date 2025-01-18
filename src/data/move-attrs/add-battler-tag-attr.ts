import type { Pokemon } from "#app/field/pokemon";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { Move } from "../move";
import type { MoveConditionFunc } from "../move-conditions";
import { ChanceBasedMoveEffectAttr, type ChanceBasedMoveEffectAttrOptions } from "./chance-based-move-effect-attr";

interface AddBattlerTagAttrOptions extends ChanceBasedMoveEffectAttrOptions {
  /** Should the move fail if the target already has a tag of the same type? */
  failOnOverlap?: boolean;
  /** The minimum number of turns the tag is active */
  turnCountMin?: number;
  /** The maximum number of turns the tag is active (inclusive) */
  turnCountMax?: number;
}

/**
 * Attribute to add a battler tag to a Pokemon of a given {@linkcode BattlerTagType | type}.
 * @extends ChanceBasedMoveEffectAttr
 * @see {@linkcode BattlerTag}
 */
export class AddBattlerTagAttr extends ChanceBasedMoveEffectAttr {
  public tagType: BattlerTagType;
  protected override options?: AddBattlerTagAttrOptions;

  constructor(tagType: BattlerTagType, selfTarget: boolean = false, options?: AddBattlerTagAttrOptions) {
    super(selfTarget);

    this.tagType = tagType;
    this.options = options;
  }

  /**
   * If `true`, causes the move to fail if the target already
   * has a tag of the same type.
   * @default false
   */
  public get failOnOverlap() {
    return this.options?.failOnOverlap ?? false;
  }

  /**
   * The minimum number of turns the tag is active
   * @default 0
   */
  public get turnCountMin() {
    return this.options?.turnCountMin ?? 0;
  }

  /**
   * The maximum number of turns the tag is active.
   * @default turnCountMin
   */
  public get turnCountMax() {
    return this.options?.turnCountMax ?? this.turnCountMin;
  }

  override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    return (this.selfTarget ? user : target).addTag(
      this.tagType,
      user.randSeedIntRange(this.turnCountMin, this.turnCountMax),
      move.id,
      user.id,
    );
  }

  override getCondition(): MoveConditionFunc | null {
    return this.failOnOverlap ? (user, target, _move) => !(this.selfTarget ? user : target).getTag(this.tagType) : null;
  }

  getTagTargetBenefitScore(): number {
    switch (this.tagType) {
      case BattlerTagType.RECHARGING:
      case BattlerTagType.PERISH_SONG:
        return -16;
      case BattlerTagType.FLINCHED:
      case BattlerTagType.CONFUSED:
      case BattlerTagType.INFATUATED:
      case BattlerTagType.NIGHTMARE:
      case BattlerTagType.DROWSY:
      case BattlerTagType.DISABLED:
      case BattlerTagType.HEAL_BLOCK:
      case BattlerTagType.RECEIVE_DOUBLE_DAMAGE:
        return -5;
      case BattlerTagType.SEEDED:
      case BattlerTagType.SALT_CURED:
      case BattlerTagType.CURSED:
      case BattlerTagType.FRENZY:
      case BattlerTagType.TRAPPED:
      case BattlerTagType.BIND:
      case BattlerTagType.WRAP:
      case BattlerTagType.FIRE_SPIN:
      case BattlerTagType.WHIRLPOOL:
      case BattlerTagType.CLAMP:
      case BattlerTagType.SAND_TOMB:
      case BattlerTagType.MAGMA_STORM:
      case BattlerTagType.SNAP_TRAP:
      case BattlerTagType.THUNDER_CAGE:
      case BattlerTagType.INFESTATION:
        return -3;
      case BattlerTagType.ENCORE:
        return -2;
      case BattlerTagType.MINIMIZED:
      case BattlerTagType.ALWAYS_GET_HIT:
        return 0;
      case BattlerTagType.INGRAIN:
      case BattlerTagType.IGNORE_ACCURACY:
      case BattlerTagType.AQUA_RING:
        return 3;
      case BattlerTagType.PROTECTED:
      case BattlerTagType.FLYING:
      case BattlerTagType.CRIT_BOOST:
      case BattlerTagType.ALWAYS_CRIT:
        return 5;
      default:
        console.warn(`BattlerTag ${BattlerTagType[this.tagType]} is missing a score!`);
        return 0;
    }
  }

  override getTargetBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    let moveChance = this.getMoveChance(user, target, move, this.selfTarget, false);
    if (moveChance < 0) {
      moveChance = 100;
    }
    return Math.floor(this.getTagTargetBenefitScore() * (moveChance / 100));
  }
}
