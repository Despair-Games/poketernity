import { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariableMoveTypeMultiplierAttr } from "#moves/variable-move-type-multiplier-attr";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute to make a move have no effect against Ice-type Pokemon.
 * Used for {@linkcode https://bulbapedia.bulbagarden.net/wiki/Sheer_Cold_(move) | Sheer Cold}.
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
