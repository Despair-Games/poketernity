import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveTypeMultiplierAttr } from "#app/data/move-attrs/variable-move-type-multiplier-attr";

export class HitsSameTypeAttr extends VariableMoveTypeMultiplierAttr {
  override apply(user: Pokemon, target: Pokemon, _move: Move, multiplier: NumberHolder): boolean {
    if (!user.getTypes().some((type) => target.getTypes().includes(type))) {
      multiplier.value = 0;
      return true;
    }
    return false;
  }
}
