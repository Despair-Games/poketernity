import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveTypeMultiplierAttr } from "#app/data/move-attrs/variable-move-type-multiplier-attr";

/**
 * Attribute to set move effectiveness to 0 if the user doesn't share a type with the target.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Synchronoise_(move) Synchronoise}.
 * @extends VariableMoveTypeMultiplierAttr
 */
export class HitsSameTypeAttr extends VariableMoveTypeMultiplierAttr {
  /** Sets the given move's type effectiveness to 0 if the user doesn't share a type with the target */
  override apply(user: Pokemon, target: Pokemon, _move: Move, multiplier: NumberHolder): boolean {
    if (!user.getTypes().some((type) => target.getTypes().includes(type))) {
      multiplier.value = 0;
      return true;
    }
    return false;
  }
}
