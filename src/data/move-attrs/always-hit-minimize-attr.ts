import { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableAccuracyAttr } from "#app/data/move-attrs/variable-accuracy-attr";

/**
 * Attribute to guarantee hits against Pokemon
 * that are {@linkcode BattlerTagType.MINIMIZED minimized}.
 * @extends VariableAccuracyAttr
 */
export class AlwaysHitMinimizeAttr extends VariableAccuracyAttr {
  override apply(_user: Pokemon, target: Pokemon, _move: Move, accuracy: NumberHolder): boolean {
    if (target.getTag(BattlerTagType.MINIMIZED)) {
      accuracy.value = -1;
      return true;
    }
    return false;
  }
}
