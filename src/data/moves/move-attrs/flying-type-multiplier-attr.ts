import { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariableMoveTypeMultiplierAttr } from "#moves/variable-move-type-multiplier-attr";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute to add Flying-type effectiveness to the current attack in addition
 * to the current attack's base effectiveness.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Flying_Press_(move) | Flying Press}.
 */
export class FlyingTypeMultiplierAttr extends VariableMoveTypeMultiplierAttr {
  override apply(user: Pokemon, target: Pokemon, _move: Move, multiplier: NumberHolder): boolean {
    multiplier.value *= target.getAttackTypeEffectiveness(ElementalType.FLYING, user);
    return true;
  }
}
