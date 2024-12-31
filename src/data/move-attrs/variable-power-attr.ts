import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";
import type { NumberHolder } from "#app/utils";

export class VariablePowerAttr extends MoveAttr {
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
