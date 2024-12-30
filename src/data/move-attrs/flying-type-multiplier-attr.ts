import { Type } from "#enums/type";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveTypeMultiplierAttr } from "#app/data/move-attrs/variable-move-type-multiplier-attr";

export class FlyingTypeMultiplierAttr extends VariableMoveTypeMultiplierAttr {
  override apply(user: Pokemon, target: Pokemon, _move: Move, multiplier: NumberHolder): boolean {
    multiplier.value *= target.getAttackTypeEffectiveness(Type.FLYING, user);
    return true;
  }
}
