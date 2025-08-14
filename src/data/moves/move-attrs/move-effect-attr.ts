import { MoveEffectTrigger } from "#enums/move-effect-trigger";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveAttr, type MoveAttrOptions } from "#moves/move-attr";

export interface MoveEffectAttrOptions extends MoveAttrOptions {
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
 * @see {@linkcode apply}
 */
export abstract class MoveEffectAttr extends MoveAttr {
  /**
   * A container for this attribute's optional parameters
   * @see {@linkcode MoveEffectAttrOptions} for supported params.
   */
  protected override options?: MoveEffectAttrOptions;

  constructor(selfTarget: boolean = false, options?: MoveEffectAttrOptions) {
    super(selfTarget);
    this.options = options;
  }

  /**
   * Defines when this effect should trigger in the move's effect order.
   * @defaultValue {@linkcode MoveEffectTrigger.POST_APPLY}
   * @see {@linkcode MoveEffectTrigger}
   */
  public get trigger() {
    return this.options?.trigger ?? MoveEffectTrigger.POST_APPLY;
  }

  /**
   * `true` if this effect should only trigger on the first hit of
   * multi-hit moves.
   * @defaultValue `false`
   */
  public get firstHitOnly() {
    return this.options?.firstHitOnly ?? false;
  }

  /**
   * `true` if this effect should only trigger on the last hit of
   * multi-hit moves.
   * @defaultValue `false`
   */
  public get lastHitOnly() {
    return this.options?.lastHitOnly ?? false;
  }

  /**
   * `true` if this effect should apply only upon hitting a target
   * for the first time when targeting multiple {@linkcode Pokemon}.
   * @defaultValue `false`
   */
  public get firstTargetOnly() {
    return this.options?.firstTargetOnly ?? false;
  }

  /**
   * Determines whether the {@linkcode Move}'s effects are valid to {@linkcode apply}
   * @param user - The {@linkcode Pokemon} using the move
   * @param target - The {@linkcode Pokemon} targeted by the move
   * @param move - The {@linkcode Move} being used
   * @param simulated - If `true`, suppresses changes to game state
   * @returns `true` if effects can apply
   */
  public canApply(user: Pokemon, target: Pokemon | null, _move: Move, _simulated: boolean = false): boolean {
    const affectedPokemon = this.selfTarget ? user : target;
    return !!affectedPokemon && !affectedPokemon.isFainted();
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
  public override apply(user: Pokemon, target: Pokemon | null, move: Move): boolean {
    if (this.canApply(user, target, move)) {
      return this.applyEffect(user, target, move);
    }
    return false;
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
  public abstract applyEffect(_user: Pokemon, _target: Pokemon | null, _move: Move): boolean;
}
