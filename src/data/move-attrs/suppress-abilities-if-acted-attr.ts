import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";
import { SuppressAbilitiesAttr } from "#app/data/move-attrs/suppress-abilities-attr";

/**
 * Applies the effects of {@linkcode SuppressAbilitiesAttr} if the target has already moved this turn.
 * @extends MoveEffectAttr
 * @see {@linkcode Moves.CORE_ENFORCER} (the move which uses this effect)
 */
export class SuppressAbilitiesIfActedAttr extends MoveEffectAttr {
  /**
   * If the target has already acted this turn, apply a {@linkcode SuppressAbilitiesAttr} effect unless the
   * abillity cannot be suppressed. This is a secondary effect and has no bearing on the success or failure of the move.
   *
   * @returns True if the move occurred, otherwise false. Note that true will be returned even if the target has not
   * yet moved or if the suppression failed to apply.
   */
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!super.apply(user, target, move)) {
      return false;
    }

    if (target.turnData.acted) {
      const suppressAttr = new SuppressAbilitiesAttr();
      if (suppressAttr.getCondition()(user, target, move)) {
        suppressAttr.apply(user, target, move);
      }
    }

    return true;
  }
}
