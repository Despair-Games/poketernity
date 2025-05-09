import { ElementalType } from "#enums/elemental-type";
import { SpeciesId } from "#enums/species-id";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariableMoveTypeAttr } from "#moves/variable-move-type-attr";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute to change a move's type based on the form of Genesect using it.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Techno_Blast_(move) | Techno Blast}.
 * @extends VariableMoveTypeAttr
 */
export class TechnoBlastTypeAttr extends VariableMoveTypeAttr {
  override apply(user: Pokemon, _target: Pokemon, _move: Move, moveType: NumberHolder): boolean {
    if (user.species.speciesId === SpeciesId.GENESECT) {
      switch (user.formIndex) {
        case 1: // Shock Drive
          moveType.value = ElementalType.ELECTRIC;
          break;
        case 2: // Burn Drive
          moveType.value = ElementalType.FIRE;
          break;
        case 3: // Chill Drive
          moveType.value = ElementalType.ICE;
          break;
        case 4: // Douse Drive
          moveType.value = ElementalType.WATER;
          break;
        default:
          moveType.value = ElementalType.NORMAL;
          break;
      }
      return true;
    }

    return false;
  }
}
