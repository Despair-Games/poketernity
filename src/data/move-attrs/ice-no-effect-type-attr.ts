import { Type } from "#enums/type";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveTypeMultiplierAttr } from "#app/data/move-attrs/variable-move-type-multiplier-attr";

export class IceNoEffectTypeAttr extends VariableMoveTypeMultiplierAttr {
  /**
   * Checks to see if the Target is Ice-Type or not. If so, the move will have no effect.
   * @param _user n/a
   * @param target The {@linkcode Pokemon} targeted by the move
   * @param _move n/a
   * @param args `[0]` a {@linkcode NumberHolder | NumberHolder} containing a type effectiveness multiplier
   * @returns `true` if this Ice-type immunity applies; `false` otherwise
   */
  override apply(_user: Pokemon, target: Pokemon, _move: Move, multiplier: NumberHolder): boolean {
    if (target.isOfType(Type.ICE)) {
      multiplier.value = 0;
      return true;
    }
    return false;
  }
}
