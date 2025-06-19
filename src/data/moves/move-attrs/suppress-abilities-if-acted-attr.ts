import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import { SuppressAbilitiesAttr } from "#moves/suppress-abilities-attr";

/**
 * Applies the effects of {@linkcode SuppressAbilitiesAttr} if the target has already moved this turn.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Core_Enforcer_(move) | Core Enforcer}.
 */
export class SuppressAbilitiesIfActedAttr extends MoveEffectAttr {
  override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (target.turnData.acted) {
      const suppressAttr = new SuppressAbilitiesAttr();
      if (suppressAttr.getCondition()(user, target, move)) {
        suppressAttr.apply(user, target, move);
      }
    }

    return true;
  }
}
