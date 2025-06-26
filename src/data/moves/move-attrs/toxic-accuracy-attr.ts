import { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariableAccuracyAttr } from "#moves/variable-accuracy-attr";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute to guarantee a hit if the user is Poison-type.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Toxic_(move) | Toxic}.
 */
export class ToxicAccuracyAttr extends VariableAccuracyAttr {
  override apply(user: Pokemon, _target: Pokemon, _move: Move, accuracy: NumberHolder): boolean {
    if (user.isOfType(ElementalType.POISON)) {
      accuracy.value = -1;
      return true;
    }

    return false;
  }
}
