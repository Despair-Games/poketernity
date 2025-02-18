import { Species } from "#enums/species";
import { ElementalType } from "#enums/elemental-type";
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
    if (user.species.speciesId === Species.GENESECT) {
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
