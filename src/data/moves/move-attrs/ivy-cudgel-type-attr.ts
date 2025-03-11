import { Species } from "#enums/species";
import { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/moves/move";
import { VariableMoveTypeAttr } from "#app/data/moves/move-attrs/variable-move-type-attr";

/**
 * Attribute implementing {@link https://bulbapedia.bulbagarden.net/wiki/Ivy_Cudgel_(move) | Ivy Cudgel}'s
 * type-changing effect. A move with this attribute changes type based on the specific form of Ogerpon using it.
 * @extends VariableMoveTypeAttr
 */
export class IvyCudgelTypeAttr extends VariableMoveTypeAttr {
  override apply(user: Pokemon, _target: Pokemon, _move: Move, moveType: NumberHolder): boolean {
    if (user.species.speciesId === Species.OGERPON) {
      switch (user.formIndex) {
        case 1: // Wellspring Mask
        case 5: // Wellspring Mask Tera
          moveType.value = ElementalType.WATER;
          break;
        case 2: // Hearthflame Mask
        case 6: // Hearthflame Mask Tera
          moveType.value = ElementalType.FIRE;
          break;
        case 3: // Cornerstone Mask
        case 7: // Cornerstone Mask Tera
          moveType.value = ElementalType.ROCK;
          break;
        case 4: // Teal Mask Tera
        default:
          moveType.value = ElementalType.GRASS;
          break;
      }
      return true;
    }

    return false;
  }
}
