import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableAccuracyAttr } from "#app/data/move-attrs/variable-accuracy-attr";

export class OneHitKOAccuracyAttr extends VariableAccuracyAttr {
  override apply(user: Pokemon, target: Pokemon, _move: Move, args: any[]): boolean {
    const accuracy = args[0] as NumberHolder;
    if (user.level < target.level) {
      accuracy.value = 0;
    } else {
      accuracy.value = Math.min(Math.max(30 + 100 * (1 - target.level / user.level), 0), 100);
    }
    return true;
  }
}
