import type { Move } from "#app/data/moves/move";
import { VariableMoveTypeAttr } from "#app/data/moves/move-attrs/variable-move-type-attr";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils/common-utils";
import { ElementalType } from "#enums/elemental-type";
import { SpeciesId } from "#enums/species-id";

/**
 * Attribute used for Tera Starstorm that changes the move type to Stellar if the user is Terastallized.
 * @extends VariableMoveTypeAttr
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
