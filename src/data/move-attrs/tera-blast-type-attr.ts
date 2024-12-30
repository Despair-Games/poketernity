import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveTypeAttr } from "#app/data/move-attrs/variable-move-type-attr";

/**
 * Changes the type of Tera Blast to match the user's tera type
 * @extends VariableMoveTypeAttr
 */
export class TeraBlastTypeAttr extends VariableMoveTypeAttr {
  /**
   * @param user {@linkcode Pokemon} the user of the move
   * @param _target {@linkcode Pokemon} N/A
   * @param _move {@linkcode Move} the move with this attribute
   * @param args `[0]` the move's type to be modified
   * @returns `true` if the move's type was modified; `false` otherwise
   */
  override apply(user: Pokemon, _target: Pokemon, _move: Move, moveType: NumberHolder): boolean {
    if (user.isTerastallized()) {
      moveType.value = user.getTeraType(); // changes move type to tera type
      return true;
    }

    return false;
  }
}
