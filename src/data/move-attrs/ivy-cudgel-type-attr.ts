import { Species } from "#enums/species";
import { ElementType } from "#enums/element-type";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveTypeAttr } from "#app/data/move-attrs/variable-move-type-attr";

/**
 * Attribute implementing {@link https://bulbapedia.bulbagarden.net/wiki/Ivy_Cudgel_(move) | Ivy Cudgel}'s
 * type-changing effect. A move with this attribute changes type based on the specific
 * form of Ogerpon (or fusion with Ogerpon) using it.
 * @extends VariableMoveTypeAttr
 */
export class IvyCudgelTypeAttr extends VariableMoveTypeAttr {
  override apply(user: Pokemon, _target: Pokemon, _move: Move, moveType: NumberHolder): boolean {
    if ([user.species.speciesId, user.fusionSpecies?.speciesId].includes(Species.OGERPON)) {
      const form = user.species.speciesId === Species.OGERPON ? user.formIndex : user.fusionSpecies?.formIndex;

      switch (form) {
        case 1: // Wellspring Mask
        case 5: // Wellspring Mask Tera
          moveType.value = ElementType.WATER;
          break;
        case 2: // Hearthflame Mask
        case 6: // Hearthflame Mask Tera
          moveType.value = ElementType.FIRE;
          break;
        case 3: // Cornerstone Mask
        case 7: // Cornerstone Mask Tera
          moveType.value = ElementType.ROCK;
          break;
        case 4: // Teal Mask Tera
        default:
          moveType.value = ElementType.GRASS;
          break;
      }
      return true;
    }

    return false;
  }
}
