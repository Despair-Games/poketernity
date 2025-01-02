import { Type } from "#enums/type";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { OneHitKOAccuracyAttr } from "#app/data/move-attrs/one-hit-ko-accuracy-attr";

/**
 * Attribute implementing {@link https://bulbapedia.bulbagarden.net/wiki/Sheer_Cold_(move) Sheer Cold}'s
 * accuracy properties. Similar to base one-hit KO accuracy rules, except
 * that it has more accuracy when used by an Ice-type Pokemon.
 * @extends OneHitKOAccuracyAttr
 */
export class SheerColdAccuracyAttr extends OneHitKOAccuracyAttr {
  override apply(user: Pokemon, target: Pokemon, _move: Move, accuracy: NumberHolder): boolean {
    if (user.level < target.level) {
      accuracy.value = 0;
    } else {
      const baseAccuracy = user.isOfType(Type.ICE) ? 30 : 20;
      accuracy.value = Math.min(Math.max(baseAccuracy + 100 * (1 - target.level / user.level), 0), 100);
    }
    return true;
  }
}
