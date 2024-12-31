import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { HealAttr } from "#app/data/move-attrs/heal-attr";

/**
 * Heals the target only if it is the ally
 * @extends HealAttr
 * @see {@linkcode apply}
 */
export class HealOnAllyAttr extends HealAttr {
  /** Heals the given target if the target is the user's ally */
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (user.getAlly() === target) {
      super.apply(user, target, move);
      return true;
    }

    return false;
  }
}
