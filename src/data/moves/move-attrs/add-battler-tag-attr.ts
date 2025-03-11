import type { Pokemon } from "#app/field/pokemon";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { Move } from "../move";
import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
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
      case BattlerTagType.CHARGING:
      case BattlerTagType.TRUANT:
      case BattlerTagType.SLOW_START:
        return -16;
      case BattlerTagType.FLINCHED:
      case BattlerTagType.CONFUSED:
      case BattlerTagType.INFATUATED:
      case BattlerTagType.NIGHTMARE:
      case BattlerTagType.DROWSY:
      case BattlerTagType.DISABLED:
      case BattlerTagType.HEAL_BLOCK:
      case BattlerTagType.RECEIVE_DOUBLE_DAMAGE:
      case BattlerTagType.INTERRUPTED:
        return -5;
      case BattlerTagType.SEEDED:
      case BattlerTagType.SALT_CURED:
      case BattlerTagType.CURSED:
      case BattlerTagType.FRENZY:
      case BattlerTagType.UPROAR:
      case BattlerTagType.TRAPPED:
      case BattlerTagType.OCTOLOCK:
      case BattlerTagType.NO_RETREAT:
      case BattlerTagType.BIND:
      case BattlerTagType.WRAP:
      case BattlerTagType.FIRE_SPIN:
      case BattlerTagType.G_MAX_FIRE_SPIN:
      case BattlerTagType.WHIRLPOOL:
      case BattlerTagType.CLAMP:
      case BattlerTagType.SAND_TOMB:
      case BattlerTagType.G_MAX_SAND_TOMB:
      case BattlerTagType.MAGMA_STORM:
      case BattlerTagType.SNAP_TRAP:
      case BattlerTagType.THUNDER_CAGE:
      case BattlerTagType.INFESTATION:
        return -3;
      case BattlerTagType.ENCORE:
      case BattlerTagType.GORILLA_TACTICS:
      case BattlerTagType.THROAT_CHOPPED:
      case BattlerTagType.TAR_SHOT:
      case BattlerTagType.TORMENT:
      case BattlerTagType.TAUNT:
      case BattlerTagType.SYRUP_BOMB:
      case BattlerTagType.TELEKINESIS:
      case BattlerTagType.POWDER:
        return -2;
      case BattlerTagType.QUASHED:
        return -1;
      case BattlerTagType.NONE:
      /**
       * @todo: Burned Up and Double Shocked terastallization considerations
       */
      case BattlerTagType.BURNED_UP:
      case BattlerTagType.DOUBLE_SHOCKED:
      case BattlerTagType.MINIMIZED:
      case BattlerTagType.ALWAYS_GET_HIT:
      case BattlerTagType.ENDURING:
      case BattlerTagType.STURDY:
      case BattlerTagType.BYPASS_SLEEP:
      case BattlerTagType.IGNORE_FLYING:
      case BattlerTagType.ROOSTED:
      case BattlerTagType.CENTER_OF_ATTENTION:
      case BattlerTagType.STOCKPILING:
      case BattlerTagType.IGNORE_GHOST:
      case BattlerTagType.IGNORE_DARK:
      case BattlerTagType.AUTOTOMIZED:
      case BattlerTagType.MYSTERY_ENCOUNTER_POST_SUMMON:
      case BattlerTagType.POWER_TRICK:
      case BattlerTagType.ELECTRIFIED:
      case BattlerTagType.COMMANDED:
      case BattlerTagType.PSYCHO_SHIFT:
      case BattlerTagType.SKY_DROP:
        return 0;
      case BattlerTagType.INGRAIN:
      case BattlerTagType.IGNORE_ACCURACY:
      case BattlerTagType.AQUA_RING:
      case BattlerTagType.HELPING_HAND:
      case BattlerTagType.PROTOSYNTHESIS:
      case BattlerTagType.QUARK_DRIVE:
      case BattlerTagType.CHARGED:
      case BattlerTagType.FLOATING:
      case BattlerTagType.SUBSTITUTE:
      case BattlerTagType.GULP_MISSILE_ARROKUDA:
      case BattlerTagType.GULP_MISSILE_PIKACHU:
      case BattlerTagType.BEAK_BLAST_CHARGING:
      case BattlerTagType.SHELL_TRAP:
      case BattlerTagType.UNBURDEN:
      case BattlerTagType.GRUDGE:
      case BattlerTagType.DESTINY_BOND:
      case BattlerTagType.RAGE:
      case BattlerTagType.IMPRISONING:
      case BattlerTagType.BYPASS_SPEED:
        return 3;
      case BattlerTagType.PROTECTED:
      case BattlerTagType.SPIKY_SHIELD:
      case BattlerTagType.KINGS_SHIELD:
      case BattlerTagType.OBSTRUCT:
      case BattlerTagType.SILK_TRAP:
      case BattlerTagType.BANEFUL_BUNKER:
      case BattlerTagType.BURNING_BULWARK:
      case BattlerTagType.FLYING:
      case BattlerTagType.UNDERGROUND:
      case BattlerTagType.UNDERWATER:
      case BattlerTagType.HIDDEN:
      case BattlerTagType.FIRE_BOOST:
      case BattlerTagType.CRIT_BOOST:
      case BattlerTagType.CRIT_BOOST_STACKABLE:
      case BattlerTagType.ALWAYS_CRIT:
      case BattlerTagType.DRAGON_CHEER:
      case BattlerTagType.ICE_FACE:
      case BattlerTagType.DISGUISE:
        return 5;
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
