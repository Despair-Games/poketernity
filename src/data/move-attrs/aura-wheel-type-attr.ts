import { Species } from "#enums/species";
import { ElementType } from "#enums/element-type";
import type { Pokemon } from "#app/field/pokemon";
import { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveTypeAttr } from "#app/data/move-attrs/variable-move-type-attr";

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

    if ([user.species.speciesId, user.fusionSpecies?.speciesId].includes(Species.MORPEKO)) {
      const form = user.species.speciesId === Species.MORPEKO ? user.formIndex : user.fusionSpecies?.formIndex;

      switch (form) {
        case 1: // Hangry Mode
          moveType.value = ElementType.DARK;
          break;
        default: // Full Belly Mode
          moveType.value = ElementType.ELECTRIC;
          break;
      }
      return true;
    }

    return false;
  }
}
