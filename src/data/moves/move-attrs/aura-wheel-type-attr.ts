import { ElementalType } from "#enums/elemental-type";
import { SpeciesId } from "#enums/species-id";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariableMoveTypeAttr } from "#moves/variable-move-type-attr";
import { NumberHolder } from "#utils/common-utils";

/**
 * Attribute to change the move's type to Dark when used by Morpeko in Hangry Mode form.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Aura_Wheel_(move) | Aura Wheel}.
 */
export class AuraWheelTypeAttr extends VariableMoveTypeAttr {
  override apply(user: Pokemon, _target: Pokemon, _move: Move, moveType: NumberHolder): boolean {
    if (!(moveType instanceof NumberHolder)) {
      return false;
    }

    if (user.species.speciesId === SpeciesId.MORPEKO) {
      const form = user.formIndex;

      switch (form) {
        case 1: // Hangry Mode
          moveType.value = ElementalType.DARK;
          break;
        default: // Full Belly Mode
          moveType.value = ElementalType.ELECTRIC;
          break;
      }
      return true;
    }

    return false;
  }
}
