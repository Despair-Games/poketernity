import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils/common-utils";
import { MoveAttr } from "#moves/move-attr";

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
