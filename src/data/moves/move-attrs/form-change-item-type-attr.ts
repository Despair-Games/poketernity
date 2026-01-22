import { ElementalType } from "#enums/elemental-type";
import { SpeciesId } from "#enums/species-id";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariableMoveTypeAttr } from "#moves/variable-move-type-attr";
import { enumValueToKey, type ValueHolder } from "#utils/common-utils";

/**
 * Attribute to change a move's type based on the user's form if they are an Arceus or Silvally.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Judgment_(move) | Judgment (Bulbapedia)}
 * @see {@linkcode https://bulbapedia.bulbagarden.net/wiki/Multi-Attack_(move) | Multi-Attack (Bulbapedia)}
 */
export class FormChangeItemTypeAttr extends VariableMoveTypeAttr {
  override apply(user: Pokemon, _target: Pokemon, move: Move, moveType: ValueHolder<ElementalType>): boolean {
    if ([SpeciesId.ARCEUS, SpeciesId.SILVALLY].includes(user.species.speciesId)) {
      moveType.value = ElementalType[enumValueToKey(ElementalType, (user.formIndex + 1) as ElementalType)];
      return true;
    }

    if (moveType.value === move.type) {
      return false;
    }
    // Force move to have its original typing if it changed
    moveType.value = move.type;
    return true;
  }
}
