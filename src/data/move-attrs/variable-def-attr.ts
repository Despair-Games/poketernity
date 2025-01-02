import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";
import type { NumberHolder } from "#app/utils";

/**
 * Attribute to change the defensive stat to
 * be used in a move's damage calculations.
 * @extends MoveAttr
 */
export class VariableDefAttr extends MoveAttr {
  constructor() {
    super();
  }

  /**
   * Changes the defensive stat used in the current attack's damage calculation
   * @param _user the {@linkcode Pokemon} using the move
   * @param _target the {@linkcode Pokemon} targeted by the move
   * @param _move the {@linkcode Move} being used
   * @param _defendingStat a {@linkcode NumberHolder} containing the defensive stat
   * used in the current attack's damage calculation.
   * @returns `true` if the defensive stat is modified by this attribute
   */
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, _defendingStat: NumberHolder): boolean {
    return false;
  }
}
