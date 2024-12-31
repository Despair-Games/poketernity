import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";
import type { NumberHolder } from "#app/utils";

export class VariableMoveCategoryAttr extends MoveAttr {
  /**
   * Modifies the given move's category based on game state
   * @param _user the {@linkcode Pokemon} using the move
   * @param _target the {@linkcode Pokemon} targeted by the move
   * @param _move the {@linkcode Move} being used
   * @param _category a {@linkcode NumberHolder} containing the
   * move's category for the turn.
   * @returns `true` if the move's category is changed by this
   * attribute
   */
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, _category: NumberHolder): boolean {
    return false;
  }
}
