import { ElementalType } from "#enums/elemental-type";
import { SpeciesId } from "#enums/species-id";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariableMoveTypeAttr } from "#moves/variable-move-type-attr";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute used for Tera Starstorm that changes the move type to Stellar if the user is Terastallized.
 */
export class TeraStarstormTypeAttr extends VariableMoveTypeAttr {
  override apply(user: Pokemon, _target: Pokemon, _move: Move, moveType: NumberHolder): boolean {
    if (user.isTerastallized && user.species.speciesId === SpeciesId.TERAPAGOS) {
      moveType.value = ElementalType.STELLAR;
      return true;
    }
    return false;
  }
}
