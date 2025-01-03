import { Species } from "#enums/species";
import { Type } from "#enums/type";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveTypeAttr } from "#app/data/move-attrs/variable-move-type-attr";

/**
 * Attribute to change a move's type based on the user's
 * form if they are an Arceus or Silvally (or a fusion of either).
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Judgment_(move) Judgment}
 * and {@linkcode https://bulbapedia.bulbagarden.net/wiki/Multi-Attack_(move) Multi-Attack}.
 * @extends VariableMoveTypeAttr
 */
export class FormChangeItemTypeAttr extends VariableMoveTypeAttr {
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
