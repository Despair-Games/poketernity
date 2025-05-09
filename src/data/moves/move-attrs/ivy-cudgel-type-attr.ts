import { ElementalType } from "#enums/elemental-type";
import { SpeciesId } from "#enums/species-id";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariableMoveTypeAttr } from "#moves/variable-move-type-attr";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute implementing {@link https://bulbapedia.bulbagarden.net/wiki/Ivy_Cudgel_(move) | Ivy Cudgel}'s
 * type-changing effect. A move with this attribute changes type based on the specific form of Ogerpon using it.
 * @extends VariableMoveTypeAttr
 */
export class IvyCudgelTypeAttr extends VariableMoveTypeAttr {
  override apply(user: Pokemon, _target: Pokemon, _move: Move, moveType: NumberHolder): boolean {
    if (user.species.speciesId === SpeciesId.OGERPON) {
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
