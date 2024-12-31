import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableAccuracyAttr } from "#app/data/move-attrs/variable-accuracy-attr";

export class OneHitKOAccuracyAttr extends VariableAccuracyAttr {
  /**
   * Sets the given move's accuracy based on accuracy rules for one-hit KO moves:
   * - If the user is of lower level than the target, accuracy is set to 0.
   * - otherwise, accuracy increases as the difference in levels between the user and the target increases.
   */
  override apply(user: Pokemon, target: Pokemon, _move: Move, accuracy: NumberHolder): boolean {
    if (user.level < target.level) {
      accuracy.value = 0;
    } else {
      accuracy.value = Math.min(Math.max(30 + 100 * (1 - target.level / user.level), 0), 100);
    }
    return true;
  }
}
