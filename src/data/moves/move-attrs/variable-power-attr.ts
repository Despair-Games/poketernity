import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveAttr } from "#moves/move-attr";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute to modify a move's power based on game state.
 * @extends MoveAttr
 */
export abstract class VariablePowerAttr extends MoveAttr {
  /**
   * Modifies the given move's power based on game state
   * @param _user the {@linkcode Pokemon} using the move
   * @param _target the {@linkcode Pokemon} targeted by the move
   * @param _move the {@linkcode Move} being used
   * @param _power a {@linkcode NumberHolder} containing the move's power for the turn
   * @returns `true` if the move's power was modified by this attribute
   */
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, _power: NumberHolder): boolean {
    return false;
  }
}
