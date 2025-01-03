import { Species } from "#enums/species";
import { Type } from "#enums/type";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveTypeAttr } from "#app/data/move-attrs/variable-move-type-attr";

/**
 * Attribute to change move type according to the form
 * of the Paldean Tauros using it.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Raging_Bull_(move) Raging Bull}.
 * @extends VariableMoveTypeAttr
 */
export class RagingBullTypeAttr extends VariableMoveTypeAttr {
  override apply(user: Pokemon, _target: Pokemon, _move: Move, moveType: NumberHolder): boolean {
    if ([user.species.speciesId, user.fusionSpecies?.speciesId].includes(Species.PALDEA_TAUROS)) {
      const form = user.species.speciesId === Species.PALDEA_TAUROS ? user.formIndex : user.fusionSpecies?.formIndex;

      switch (form) {
        case 1: // Blaze breed
          moveType.value = Type.FIRE;
          break;
        case 2: // Aqua breed
          moveType.value = Type.WATER;
          break;
        default:
          moveType.value = Type.FIGHTING;
          break;
      }
      return true;
    }

    return false;
  }
}
