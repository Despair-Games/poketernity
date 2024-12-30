import { Species } from "#enums/species";
import { Type } from "#enums/type";
import type { Pokemon } from "#app/field/pokemon";
import { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveTypeAttr } from "#app/data/move-attrs/variable-move-type-attr";

export class AuraWheelTypeAttr extends VariableMoveTypeAttr {
  override apply(user: Pokemon, _target: Pokemon, _move: Move, moveType: NumberHolder): boolean {
    if (!(moveType instanceof NumberHolder)) {
      return false;
    }

    if ([user.species.speciesId, user.fusionSpecies?.speciesId].includes(Species.MORPEKO)) {
      const form = user.species.speciesId === Species.MORPEKO ? user.formIndex : user.fusionSpecies?.formIndex;

      switch (form) {
        case 1: // Hangry Mode
          moveType.value = Type.DARK;
          break;
        default: // Full Belly Mode
          moveType.value = Type.ELECTRIC;
          break;
      }
      return true;
    }

    return false;
  }
}
