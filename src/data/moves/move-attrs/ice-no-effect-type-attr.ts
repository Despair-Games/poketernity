import { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/moves/move";
import { VariableMoveTypeMultiplierAttr } from "#app/data/moves/move-attrs/variable-move-type-multiplier-attr";

/**
 * Attribute to make a move have no effect against Ice-type Pokemon.
 * Used for {@linkcode https://bulbapedia.bulbagarden.net/wiki/Sheer_Cold_(move) | Sheer Cold}.
 * @extends VariableMoveTypeMultiplierAttr
 */
export class IceNoEffectTypeAttr extends VariableMoveTypeMultiplierAttr {
  override apply(_user: Pokemon, target: Pokemon, _move: Move, multiplier: NumberHolder): boolean {
    if (target.isOfType(ElementalType.ICE)) {
      multiplier.value = 0;
      return true;
    }
    return false;
  }
}
