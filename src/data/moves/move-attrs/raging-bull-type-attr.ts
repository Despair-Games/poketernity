import { ElementalType } from "#enums/elemental-type";
import { SpeciesId } from "#enums/species-id";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariableMoveTypeAttr } from "#moves/variable-move-type-attr";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute to change move type according to the form
 * of the Paldean Tauros using it.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Raging_Bull_(move) | Raging Bull}.
 */
export class RagingBullTypeAttr extends VariableMoveTypeAttr {
  override apply(user: Pokemon, _target: Pokemon, _move: Move, moveType: NumberHolder): boolean {
    if (user.species.speciesId === SpeciesId.PALDEA_TAUROS) {
      switch (user.formIndex) {
        case 1: // Blaze breed
          moveType.value = ElementalType.FIRE;
          break;
        case 2: // Aqua breed
          moveType.value = ElementalType.WATER;
          break;
        default:
          moveType.value = ElementalType.FIGHTING;
          break;
      }
      return true;
    }

    return false;
  }
}
