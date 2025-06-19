import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveAttr } from "#moves/move-attr";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute to modify a move's type based on game state.
 */
export abstract class VariableMoveTypeAttr extends MoveAttr {
  /**
   * Modifies the given move's type based on game state
   * @param _user the {@linkcode Pokemon} using the move
   * @param _target the {@linkcode Pokemon} targeted by the move
   * @param _move the {@linkcode Move} being used
   * @param _moveType a {@linkcode NumberHolder} containing the move's type for the turn.
   * @returns
   */
  override apply(_user: Pokemon, _target: Pokemon | null, _move: Move, _moveType: NumberHolder): boolean {
    return false;
  }
}
