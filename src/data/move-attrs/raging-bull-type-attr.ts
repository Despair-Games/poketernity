import { Species } from "#enums/species";
import { Type } from "#enums/type";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveTypeAttr } from "#app/data/move-attrs/variable-move-type-attr";

export class RagingBullTypeAttr extends VariableMoveTypeAttr {
  /**
   * If the user is a Paldean Tauros (or a fusion with the species),
   * changes the given move's type according to the Tauros' form.
   */
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
