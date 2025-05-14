import { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariableMoveTypeAttr } from "#moves/variable-move-type-attr";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute to change move type to match the user's primary type.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Revelation_Dance_(move) | Revelation Dance}.
 * @extends VariableMoveTypeAttr
 */
export class MatchUserTypeAttr extends VariableMoveTypeAttr {
  override apply(user: Pokemon, _target: Pokemon, _move: Move, moveType: NumberHolder): boolean {
    const userTypes = user.getTypes(true);

    if (userTypes.includes(ElementalType.STELLAR)) {
      // will not change to stellar type
      const nonTeraTypes = user.getTypes();
      moveType.value = nonTeraTypes[0];
      return true;
    }
    if (userTypes.length > 0) {
      moveType.value = userTypes[0];
      return true;
    }
    return false;
  }
}
