import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";
import type { NumberHolder } from "#app/utils";

export class ChangeMultiHitTypeAttr extends MoveAttr {
  /**
   * Changes the given move's multi-hit type
   * @param _user the {@linkcode Pokemon} using the move
   * @param _target the {@linkcode Pokemon} targeted by the move
   * @param _move the {@linkcode Move} being used
   * @param _hitType a {@linkcode NumberHolder} containing the move's multi-hit type
   * @returns `true` if this attribute changes the move's multi-hit type
   * @see {@linkcode MultiHitType}
   */
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, _hitType: NumberHolder): boolean {
    return false;
  }
}
