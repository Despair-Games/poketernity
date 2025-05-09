import { ElementalType } from "#enums/elemental-type";
import { SpeciesId } from "#enums/species-id";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariableMoveTypeAttr } from "#moves/variable-move-type-attr";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute to change a move's type based on the user's form if they are an Arceus or Silvally.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Judgment_(move) | Judgment}
 * and {@linkcode https://bulbapedia.bulbagarden.net/wiki/Multi-Attack_(move) | Multi-Attack}.
 * @extends VariableMoveTypeAttr
 */
export class FormChangeItemTypeAttr extends VariableMoveTypeAttr {
  override apply(user: Pokemon, _target: Pokemon, _move: Move, moveType: NumberHolder): boolean {
    if ([SpeciesId.ARCEUS, SpeciesId.SILVALLY].includes(user.species.speciesId)) {
      moveType.value = ElementalType[ElementalType[user.formIndex]];
      return true;
    }

    return false;
  }
}
