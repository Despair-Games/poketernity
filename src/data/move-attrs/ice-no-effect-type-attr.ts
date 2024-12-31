import { Type } from "#enums/type";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveTypeMultiplierAttr } from "#app/data/move-attrs/variable-move-type-multiplier-attr";

export class IceNoEffectTypeAttr extends VariableMoveTypeMultiplierAttr {
  /** Sets the given move's type effectiveness to 0 if the target is Ice type */
  override apply(_user: Pokemon, target: Pokemon, _move: Move, multiplier: NumberHolder): boolean {
    if (target.isOfType(Type.ICE)) {
      multiplier.value = 0;
      return true;
    }
    return false;
  }
}
