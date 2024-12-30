import { Type } from "#enums/type";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { OneHitKOAccuracyAttr } from "#app/data/move-attrs/one-hit-ko-accuracy-attr";

export class SheerColdAccuracyAttr extends OneHitKOAccuracyAttr {
  /**
   * Changes the normal One Hit KO Accuracy Attr to implement the Gen VII changes,
   * where if the user is Ice-Type, it has more accuracy.
   * @param user Pokemon that is using the move; checks the Pokemon's level.
   * @param target Pokemon that is receiving the move; checks the Pokemon's level.
   * @param _move N/A
   * @param accuracy Uses the accuracy argument, allowing to change it from either 0 if it doesn't pass
   * the first if/else, or 30/20 depending on the type of the user Pokemon.
   * @returns Returns true if move is successful, false if misses.
   */
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
