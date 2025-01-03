import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { HealAttr } from "#app/data/move-attrs/heal-attr";

/**
 * Heals the target only if it is the ally.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Pollen_Puff_(move) Pollen Puff}.
 * @extends HealAttr
 */
export class HealOnAllyAttr extends HealAttr {
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (user.getAlly() === target) {
      super.apply(user, target, move);
      return true;
    }

    return false;
  }
}
