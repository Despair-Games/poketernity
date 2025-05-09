import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils/common-utils";
import { BattlerTagType } from "#enums/battler-tag-type";
import { VariableAccuracyAttr } from "#moves/variable-accuracy-attr";

/**
 * Attribute to guarantee hits against Pokemon
 * that are {@linkcode BattlerTagType.MINIMIZED | minimized}.
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
