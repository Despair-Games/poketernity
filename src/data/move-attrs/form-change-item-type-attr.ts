import { Species } from "#enums/species";
import { Type } from "#enums/type";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveTypeAttr } from "#app/data/move-attrs/variable-move-type-attr";

export class FormChangeItemTypeAttr extends VariableMoveTypeAttr {
  /**
   * Modifies the given move's type based on the user's form
   * if the user is Arceus or Silvally (or a fusion of either)
   */
  override apply(user: Pokemon, _target: Pokemon, _move: Move, moveType: NumberHolder): boolean {
    if (
      [user.species.speciesId, user.fusionSpecies?.speciesId].includes(Species.ARCEUS)
      || [user.species.speciesId, user.fusionSpecies?.speciesId].includes(Species.SILVALLY)
    ) {
      const form =
        user.species.speciesId === Species.ARCEUS || user.species.speciesId === Species.SILVALLY
          ? user.formIndex
          : user.fusionSpecies?.formIndex!;

      moveType.value = Type[Type[form]];
      return true;
    }

    return false;
  }
}
