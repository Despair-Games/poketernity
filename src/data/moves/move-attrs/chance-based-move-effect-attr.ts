import type { EnemyPokemon, Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { NumberHolder } from "#app/utils";
import { ArenaTagType } from "#enums/arena-tag-type";
import { applyAbAttrs } from "#app/data/abilities/apply-ab-attrs";
import type { Move } from "../move";
import { MoveEffectAttr, type MoveEffectAttrOptions } from "./move-effect-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";

export interface ChanceBasedMoveEffectAttrOptions extends MoveEffectAttrOptions {
  /** Overrides the secondary effect chance for this attr if set. */
  effectChanceOverride?: number;
}

/**
 * Attribute for effects that have a random chance of triggering.
 * @extends MoveEffectAttr
 */
export abstract class ChanceBasedMoveEffectAttr extends MoveEffectAttr {
  protected override options?: ChanceBasedMoveEffectAttrOptions;

  constructor(selfTarget: boolean = false, options?: ChanceBasedMoveEffectAttrOptions) {
    super(selfTarget, options);
    this.options = options;
  }

  /**
   * If defined, overrides the move's base chance for this
   * secondary effect to trigger.
   */
  public get effectChanceOverride() {
    return this.options?.effectChanceOverride;
  }

  public override canApply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (super.canApply(user, target, move)) {
      const effectChance = this.getMoveChance(user, target, move, true);
      return effectChance < 0 || user.randSeedInt(100) < effectChance;
    }
    return false;
  }

  /**
   * Gets the used move's additional effect chance after modifications from:
   * - the user's Sheer Force and/or Serene Grace
   * - the target's Shield Dust
   * - the "rainbow effect" from combining Water Pledge and Fire Pledge
   * @param user the {@linkcode Pokemon} using this move
   * @param target the {@linkcode Pokemon} targeted by the move
   * @param move the {@linkcode Move} being used
   * @param showAbility `true` if this function call should prompt the ability flyout to show. Defaults to `false`.
   * @returns The final percent chance of this attribute's effect applying. If negative, the
   * effect is guaranteed to apply.
   */
  public getMoveChance(user: Pokemon, target: Pokemon, move: Move, showAbility: boolean = false): number {
    const moveChance = new NumberHolder(this.effectChanceOverride ?? move.chance);

    applyAbAttrs(AbAttrFlag.MOVE_EFFECT_CHANCE_MULTIPLIER, user, false, moveChance, move, showAbility);

    const userSide = user.getArenaTagSide();
    globalScene.arena.applyTagsForSide(ArenaTagType.WATER_FIRE_PLEDGE, userSide, false, moveChance);

    if (!this.selfTarget) {
      applyAbAttrs(AbAttrFlag.IGNORE_MOVE_EFFECTS, target, false, user, move, moveChance);
    }
    return moveChance.value;
  }

  /**
   * Calculates effect score, factoring in this attribute's {@linkcode getRawEffectScore | raw effect score}
   * and {@linkcode getMoveChance | chance to apply}.
   */
  public override getEffectScore(user: EnemyPokemon, target: Pokemon, move: Move): number {
    /**
     * The attribute's chance to apply its effect
     * @todo this chance calculation may prematurely reveal abilities
     */
    const chance = this.getMoveChance(user, target, move);
    /** The attribute's effect score, assuming its effect always applies */
    const rawScore = this.getRawEffectScore(user, target, move);

    /**
     * The attribute's effect score after factoring in effect chance.
     * This may be a decimal number; the final output is either
     * `floor(chanceWeightedScore)` or `floor(chanceWeightedScore) + 1`
     */
    const chanceWeightedScore = chance * rawScore;
    /** The minimum integer score this function can return */
    const minScore = Math.floor(chanceWeightedScore);
    /**
     * The chance to return `minScore + 1` instead of `minScore`.
     * This is the decimal component of `chanceWeightedScore` scaled
     * up to a percent value, then rounded down.
     */
    const tierUpChance = Math.floor((chanceWeightedScore % 1) * 100);

    return minScore + this.getRandomScore(user, tierUpChance);
  }

  /**
   * Calculates the move action's raw effect score (before effect chance is accounted for).
   * Unlike other attributes' scores, this can be a decimal value.
   * @param user the {@linkcode EnemyPokemon} evaluating the move
   * @param target the {@linkcode Pokemon} the move is evaluated against
   * @param move the {@linkcode Move} being evaluated
   * @todo make this `abstract` once attribute scores are filled in
   */
  protected getRawEffectScore(_user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    return 0;
  }
}
