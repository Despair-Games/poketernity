import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";
import type { NumberHolder } from "#app/utils";

/**
 * Attribute to modify a move's type effectiveness in certain
 * game states.
 * @extends MoveAttr
 */
export class VariableMoveTypeMultiplierAttr extends MoveAttr {
  /**
   * Modifies the given move's type effectiveness multiplier based on game state
   * @param _user the {@linkcode Pokemon} using the move
   * @param _target the {@linkcode Pokemon} targeted by the move
   * @param _move the {@linkcode Move} being used
   * @param _multiplier a {@linkcode NumberHolder} containing the move's type
   * effectiveness multiplier for the current attack.
   * @returns `true` if the move's type effectiveness was modified by this attribute
   */
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, _multiplier: NumberHolder): boolean {
    return false;
  }
}
