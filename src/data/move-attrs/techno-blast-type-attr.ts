import { Species } from "#enums/species";
import { ElementType } from "#enums/element-type";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveTypeAttr } from "#app/data/move-attrs/variable-move-type-attr";

/**
 * Attribute to change a move's type based on the form of Genesect using it.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Techno_Blast_(move) | Techno Blast}.
 * @extends VariableMoveTypeAttr
 */
export class TechnoBlastTypeAttr extends VariableMoveTypeAttr {
  override apply(user: Pokemon, _target: Pokemon, _move: Move, moveType: NumberHolder): boolean {
    if ([user.species.speciesId, user.fusionSpecies?.speciesId].includes(Species.GENESECT)) {
      const form = user.species.speciesId === Species.GENESECT ? user.formIndex : user.fusionSpecies?.formIndex;

      switch (form) {
        case 1: // Shock Drive
          moveType.value = ElementType.ELECTRIC;
          break;
        case 2: // Burn Drive
          moveType.value = ElementType.FIRE;
          break;
        case 3: // Chill Drive
          moveType.value = ElementType.ICE;
          break;
        case 4: // Douse Drive
          moveType.value = ElementType.WATER;
          break;
        default:
          moveType.value = ElementType.NORMAL;
          break;
      }
      return true;
    }

    return false;
  }
}
