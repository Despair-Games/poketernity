import { Type } from "#enums/type";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveTypeMultiplierAttr } from "#app/data/move-attrs/variable-move-type-multiplier-attr";

export class FlyingTypeMultiplierAttr extends VariableMoveTypeMultiplierAttr {
  /** Applies Flying-type effectiveness to the current attack in addition to the attack's base effectiveness */
  override apply(user: Pokemon, target: Pokemon, _move: Move, multiplier: NumberHolder): boolean {
    multiplier.value *= target.getAttackTypeEffectiveness(Type.FLYING, user);
    return true;
  }
}
