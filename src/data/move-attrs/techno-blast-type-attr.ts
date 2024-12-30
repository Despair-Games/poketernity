import { Species } from "#enums/species";
import { Type } from "#enums/type";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveTypeAttr } from "#app/data/move-attrs/variable-move-type-attr";

export class TechnoBlastTypeAttr extends VariableMoveTypeAttr {
  override apply(user: Pokemon, _target: Pokemon, _move: Move, moveType: NumberHolder): boolean {
    if ([user.species.speciesId, user.fusionSpecies?.speciesId].includes(Species.GENESECT)) {
      const form = user.species.speciesId === Species.GENESECT ? user.formIndex : user.fusionSpecies?.formIndex;

      switch (form) {
        case 1: // Shock Drive
          moveType.value = Type.ELECTRIC;
          break;
        case 2: // Burn Drive
          moveType.value = Type.FIRE;
          break;
        case 3: // Chill Drive
          moveType.value = Type.ICE;
          break;
        case 4: // Douse Drive
          moveType.value = Type.WATER;
          break;
        default:
          moveType.value = Type.NORMAL;
          break;
      }
      return true;
    }

    return false;
  }
}
