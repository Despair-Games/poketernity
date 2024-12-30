import { Species } from "#enums/species";
import { Type } from "#enums/type";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveTypeAttr } from "#app/data/move-attrs/variable-move-type-attr";

export class IvyCudgelTypeAttr extends VariableMoveTypeAttr {
  override apply(user: Pokemon, _target: Pokemon, _move: Move, moveType: NumberHolder): boolean {
    if ([user.species.speciesId, user.fusionSpecies?.speciesId].includes(Species.OGERPON)) {
      const form = user.species.speciesId === Species.OGERPON ? user.formIndex : user.fusionSpecies?.formIndex;

      switch (form) {
        case 1: // Wellspring Mask
        case 5: // Wellspring Mask Tera
          moveType.value = Type.WATER;
          break;
        case 2: // Hearthflame Mask
        case 6: // Hearthflame Mask Tera
          moveType.value = Type.FIRE;
          break;
        case 3: // Cornerstone Mask
        case 7: // Cornerstone Mask Tera
          moveType.value = Type.ROCK;
          break;
        case 4: // Teal Mask Tera
        default:
          moveType.value = Type.GRASS;
          break;
      }
      return true;
    }

    return false;
  }
}
