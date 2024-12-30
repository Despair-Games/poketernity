import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { HealAttr } from "#app/data/move-attrs/heal-attr";

/**
 * Heals the target only if it is the ally
 * @extends HealAttr
 * @see {@linkcode apply}
 */

export class HealOnAllyAttr extends HealAttr {
  /**
   * @param user {@linkcode Pokemon} using the move
   * @param target {@linkcode Pokemon} target of the move
   * @param move {@linkcode Move} with this attribute
   * @param args N/A
   * @returns true if the function succeeds
   */
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (user.getAlly() === target) {
      super.apply(user, target, move);
      return true;
    }

    return false;
  }
}
