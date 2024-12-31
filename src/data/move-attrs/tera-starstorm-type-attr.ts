import { Species } from "#enums/species";
import { Type } from "#enums/type";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { type Move } from "#app/data/move";
import { VariableMoveTypeAttr } from "#app/data/move-attrs/variable-move-type-attr";

/**
 * Attribute used for Tera Starstorm that changes the move type to Stellar
 * @extends VariableMoveTypeAttr
 */
export class TeraStarstormTypeAttr extends VariableMoveTypeAttr {
  /** Changes the given move's type to {@linkcode Type.STELLAR Stellar} if the user is terastallized */
  override apply(user: Pokemon, _target: Pokemon, _move: Move, moveType: NumberHolder): boolean {
    if (
      user.isTerastallized()
      && (user.hasFusionSpecies(Species.TERAPAGOS) || user.species.speciesId === Species.TERAPAGOS)
    ) {
      moveType.value = Type.STELLAR;
      return true;
    }
    return false;
  }
}
