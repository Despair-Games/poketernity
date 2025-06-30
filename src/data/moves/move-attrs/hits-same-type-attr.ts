import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariableMoveTypeMultiplierAttr } from "#moves/variable-move-type-multiplier-attr";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute to set move effectiveness to 0 if the user doesn't share a type with the target.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Synchronoise_(move) | Synchronoise}.
 */
export class HitsSameTypeAttr extends VariableMoveTypeMultiplierAttr {
  override apply(user: Pokemon, target: Pokemon, _move: Move, multiplier: NumberHolder): boolean {
    if (!user.getTypes().some((type) => target.getTypes().includes(type))) {
      multiplier.value = 0;
      return true;
    }
    return false;
  }
}
