import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";
import type { NumberHolder } from "#app/utils";

export class VariableAtkAttr extends MoveAttr {
  constructor() {
    super();
  }

  /**
   * Changes the offensive stat used for the current attack's damage calculation
   * @param _user the {@linkcode Pokemon} using the move
   * @param _target the {@linkcode Pokemon} targeted by the move
   * @param _move the {@linkcode Move} being used
   * @param _attackingStat a {@linkcode NumberHolder} containing the offensive stat
   * for the current attack's damage calculation
   * @returns `true` if the offensive stat is modified by this attribute
   */
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, _attackingStat: NumberHolder): boolean {
    return false;
  }
}
