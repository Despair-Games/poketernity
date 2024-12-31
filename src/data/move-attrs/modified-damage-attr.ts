import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";

export class ModifiedDamageAttr extends MoveAttr {
  /**
   * Modifies damage after damage is otherwise fully calculated.
   * Typically used to enforce a damage threshold on a move.
   * @param user the {@linkcode Pokemon} using the move
   * @param target the {@linkcode Pokemon} targeted by the move
   * @param move the {@linkcode Move} being used
   * @param damage a {@linkcode NumberHolder} containing post-calculation damage
   * @returns `true` if damage is modified
   */
  override apply(user: Pokemon, target: Pokemon, move: Move, damage: NumberHolder): boolean {
    damage.value = this.getModifiedDamage(user, target, move, damage.value);

    return true;
  }

  /**
   * Calculates the move's damage output after applying this damage modifier
   * @param _user the {@linkcode Pokemon} using the move
   * @param _target the {@linkcode Pokemon} targeted by the move
   * @param _move the {@linkcode Move} being used
   * @param damage the calculated damage before applying this modifier
   * @returns the modified damage
   */
  getModifiedDamage(_user: Pokemon, _target: Pokemon, _move: Move, damage: number): number {
    return damage;
  }
}
