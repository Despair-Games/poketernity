import { Species } from "#enums/species";
import { Type } from "#enums/type";
import type { Pokemon } from "#app/field/pokemon";
import { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveTypeAttr } from "#app/data/move-attrs/variable-move-type-attr";

export class FormChangeItemTypeAttr extends VariableMoveTypeAttr {
  override apply(user: Pokemon, _target: Pokemon, _move: Move, args: any[]): boolean {
    const moveType = args[0];
    if (!(moveType instanceof NumberHolder)) {
      return false;
    }

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
