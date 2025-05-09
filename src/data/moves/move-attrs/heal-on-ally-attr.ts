import type { Pokemon } from "#field/pokemon";
import { HealAttr } from "#moves/heal-attr";
import type { Move } from "#moves/move";

/**
 * Heals the target only if it is the ally.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Pollen_Puff_(move) | Pollen Puff}.
 * @extends HealAttr
 */
export class HealOnAllyAttr extends HealAttr {
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (user.getAlly() === target) {
      user.stopMultiHit();
      super.apply(user, target, move);
      return true;
    }

    return false;
  }
}
