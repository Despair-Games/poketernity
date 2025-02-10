import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveEffectTrigger } from "#enums/move-effect-trigger";
import type { Pokemon } from "#app/field/pokemon";
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
   * Determines whether the {@linkcode Move}'s effects are valid to {@linkcode apply}
   * @virtual
   * @param user the {@linkcode Pokemon} using the move
   * @param target the {@linkcode Pokemon} targeted by the move
   * @param move the {@linkcode Move} being used
   * @returns `true` if effects can apply
   */
  canApply(user: Pokemon, target: Pokemon | null, _move: Move): boolean {
    return this.selfTarget ? !user.isFainted() && !user.getTag(BattlerTagType.FRENZY) : !!target && !target.isFainted();
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
  override apply(user: Pokemon, target: Pokemon | null, move: Move): boolean {
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
  abstract applyEffect(_user: Pokemon, _target: Pokemon | null, _move: Move): boolean;
}
