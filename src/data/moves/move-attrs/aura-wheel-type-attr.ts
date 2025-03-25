import { SpeciesId } from "#enums/species-id";
import { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#app/field/pokemon";
import { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/moves/move";
import { VariableMoveTypeAttr } from "#app/data/moves/move-attrs/variable-move-type-attr";

/**
 * Attribute to change the move's type to Dark when used by Morpeko in Hangry Mode form.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Aura_Wheel_(move) | Aura Wheel}.
 * @extends VariableMoveTypeAttr
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
