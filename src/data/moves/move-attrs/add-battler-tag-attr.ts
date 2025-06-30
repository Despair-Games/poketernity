import type { BattlerTagType } from "#enums/battler-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { ChanceBasedMoveEffectAttr, type ChanceBasedMoveEffectAttrOptions } from "#moves/chance-based-move-effect-attr";
import type { Move } from "#moves/move";
import type { MoveCondition } from "#moves/move-condition";
import type { MoveConditionFunc } from "#types/move-condition-func";

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
 * @see {@linkcode BattlerTag}
 */
export abstract class AddBattlerTagAttr extends ChanceBasedMoveEffectAttr {
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
   * @defaultValue `false`
   */
  public get failOnOverlap() {
    return this.options?.failOnOverlap ?? false;
  }

  /**
   * The minimum number of turns the tag is active
   * @defaultValue `0`
   */
  public get turnCountMin() {
    return this.options?.turnCountMin ?? 0;
  }

  /**
   * The maximum number of turns the tag is active.
   * @defaultValue {@linkcode turnCountMin}
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

  override getCondition(): MoveCondition | MoveConditionFunc | null {
    return this.failOnOverlap ? (user, target, _move) => !(this.selfTarget ? user : target).hasTag(this.tagType) : null;
  }

  public abstract override getRawEffectScore(user: EnemyPokemon, target: Pokemon, move: Move): number;
}
