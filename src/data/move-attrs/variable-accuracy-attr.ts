import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";
import type { NumberHolder } from "#app/utils";

export class VariableAccuracyAttr extends MoveAttr {
  /**
   * Modifies the given move's accuracy based on game state
   * @param _user the {@linkcode Pokemon} using the move
   * @param _target the {@linkcode Pokemon} targeted by the move
   * @param _move the {@linkcode Move} being used
   * @param _accuracy a {@linkcode NumberHolder} containing the move's accuracy for the turn.
   * @returns `true` if accuracy was modified
   */
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, _accuracy: NumberHolder): boolean {
    return false;
  }
}
