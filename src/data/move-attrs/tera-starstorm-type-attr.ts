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
  /**
   *
   * @param user the {@linkcode Pokemon} using the move
   * @param _target n/a
   * @param _move n/a
   * @param args[0] {@linkcode NumberHolder} the move type
   * @returns `true` if the move type is changed to {@linkcode Type.STELLAR}, `false` otherwise
   */
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
