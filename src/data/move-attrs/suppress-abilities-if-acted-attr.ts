import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";
import { SuppressAbilitiesAttr } from "#app/data/move-attrs/suppress-abilities-attr";

/**
 * Applies the effects of {@linkcode SuppressAbilitiesAttr} if the target has already moved this turn.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Core_Enforcer_(move) Core Enforcer}.
 * @extends MoveEffectAttr
 */
export class SuppressAbilitiesIfActedAttr extends MoveEffectAttr {
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
