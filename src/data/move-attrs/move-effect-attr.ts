import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveEffectTrigger } from "#enums/move-effect-trigger";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { NumberHolder } from "#app/utils";
import { IgnoreMoveEffectsAbAttr } from "#app/data/ab-attrs/ignore-move-effect-ab-attr";
import { MoveEffectChanceMultiplierAbAttr } from "#app/data/ab-attrs/move-effect-chance-multiplier-ab-attr";
import { applyAbAttrs } from "#app/data/ability";
import { type Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";

export interface MoveEffectAttrOptions {
  /**
   * Defines when this effect should trigger in the move's effect order
   * @see {@linkcode MoveEffectPhase}
   */
  trigger?: MoveEffectTrigger;
  /** Should this effect only apply on the first hit? */
  firstHitOnly?: boolean;
  /** Should this effect only apply on the last hit? */
  lastHitOnly?: boolean;
  /** Should this effect only apply on the first target hit? */
  firstTargetOnly?: boolean;
  /** Overrides the secondary effect chance for this attr if set. */
  effectChanceOverride?: number;
}

/**
 * Base class defining all Move Effect Attributes
 * @extends MoveAttr
 * @see {@linkcode apply}
 */
export abstract class MoveEffectAttr extends MoveAttr {
  /**
   * A container for this attribute's optional parameters
   * @see {@linkcode MoveEffectAttrOptions} for supported params.
   */
  protected options?: MoveEffectAttrOptions;

  constructor(selfTarget: boolean = false, options?: MoveEffectAttrOptions) {
    super(selfTarget);
    this.options = options;
  }

  /**
   * Defines when this effect should trigger in the move's effect order.
   * @default MoveEffectTrigger.POST_APPLY
   * @see {@linkcode MoveEffectTrigger}
   */
  public get trigger() {
    return this.options?.trigger ?? MoveEffectTrigger.POST_APPLY;
  }

  /**
   * `true` if this effect should only trigger on the first hit of
   * multi-hit moves.
   * @default false
   */
  public get firstHitOnly() {
    return this.options?.firstHitOnly ?? false;
  }

  /**
   * `true` if this effect should only trigger on the last hit of
   * multi-hit moves.
   * @default false
   */
  public get lastHitOnly() {
    return this.options?.lastHitOnly ?? false;
  }

  /**
   * `true` if this effect should apply only upon hitting a target
   * for the first time when targeting multiple {@linkcode Pokemon}.
   * @default false
   */
  public get firstTargetOnly() {
    return this.options?.firstTargetOnly ?? false;
  }

  /**
   * If defined, overrides the move's base chance for this
   * secondary effect to trigger.
   */
  public get effectChanceOverride() {
    return this.options?.effectChanceOverride;
  }

  /**
   * Determines whether the {@linkcode Move}'s effects are valid to {@linkcode apply}
   * @virtual
   * @param user the {@linkcode Pokemon} using the move
   * @param target the {@linkcode Pokemon} targeted by the move
   * @param move the {@linkcode Move} being used
   * @returns `true` if effects can apply
   */
  canApply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (
      (this.selfTarget && (user.isFainted() || user.getTag(BattlerTagType.FRENZY)))
      || (!this.selfTarget && target.isFainted())
    ) {
      return false;
    }

    const effectChance = this.getMoveChance(user, target, move, this.selfTarget, true);
    return effectChance < 0 || user.randSeedInt(100) < effectChance;
  }

  /**
   * Checks if this attribute's effect can be applied, and if so, applies the move effect.
   * Subclasses of this attribute should override {@linkcode applyEffect} instead of this
   * method.
   * @param user the {@linkcode Pokemon} using the move
   * @param target the {@linkcode Pokemon} targeted by the move
   * @param move the {@linkcode Move} being used
   * @sealed
   */
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (this.canApply(user, target, move)) {
      return this.applyEffect(user, target, move);
    } else {
      return false;
    }
  }

  /**
   * Applies this attribute's effects.
   * Subclasses should override this method instead of {@linkcode apply}
   * to implement their own move effects.
   * @param user the {@linkcode Pokemon} using the move
   * @param target the {@linkcode Pokemon} targeted by the move
   * @param move the {@linkcode Move} being used
   * @returns `true` if effects successfully applied.
   */
  applyEffect(_user: Pokemon, _target: Pokemon, _move: Move): boolean {
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
   * @param selfEffect `true` if move targets user.
   * @returns The final percent chance of this attribute's effect applying. If negative, the
   * effect is guaranteed to apply.
   */
  getMoveChance(user: Pokemon, target: Pokemon, move: Move, selfEffect: boolean, showAbility: boolean = false): number {
    const moveChance = new NumberHolder(this.effectChanceOverride ?? move.chance);

    applyAbAttrs(MoveEffectChanceMultiplierAbAttr, user, false, moveChance, move, showAbility);

    const userSide = user.getArenaTagSide();
    globalScene.arena.applyTagsForSide(ArenaTagType.WATER_FIRE_PLEDGE, userSide, false, moveChance);

    if (!selfEffect) {
      applyAbAttrs(IgnoreMoveEffectsAbAttr, target, false, user, move, moveChance);
    }
    return moveChance.value;
  }
}
