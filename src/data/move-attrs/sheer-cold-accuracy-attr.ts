import { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { OneHitKOAccuracyAttr } from "#app/data/move-attrs/one-hit-ko-accuracy-attr";

/**
 * Attribute implementing {@link https://bulbapedia.bulbagarden.net/wiki/Sheer_Cold_(move) | Sheer Cold}'s
 * accuracy properties. Similar to base one-hit KO accuracy rules, except
 * that it has more accuracy when used by an Ice-type Pokemon.
 * @extends OneHitKOAccuracyAttr
 */
export class SheerColdAccuracyAttr extends OneHitKOAccuracyAttr {
  override apply(user: Pokemon, target: Pokemon, _move: Move, accuracy: NumberHolder): boolean {
    if (user.level < target.level) {
      accuracy.value = 0;
    } else {
      /** TODO: In game should still display 30 */
      const baseAccuracy = user.isOfType(ElementalType.ICE) ? 30 : 20;
      accuracy.value = Math.min(baseAccuracy + user.level - target.level, 100);
    }
    return true;
  }
}
