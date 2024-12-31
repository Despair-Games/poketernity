import { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableAccuracyAttr } from "#app/data/move-attrs/variable-accuracy-attr";

/**
 * Attribute used for moves which never miss
 * against Pokemon with the {@linkcode BattlerTagType.MINIMIZED}
 * @extends VariableAccuracyAttr
 * @see {@linkcode apply}
 */
export class AlwaysHitMinimizeAttr extends VariableAccuracyAttr {
  /** Sets move accuracy to guarantee a hit if the target is {@linkcode BattlerTagType.MINIMIZED minimized}. */
  override apply(_user: Pokemon, target: Pokemon, _move: Move, accuracy: NumberHolder): boolean {
    if (target.getTag(BattlerTagType.MINIMIZED)) {
      accuracy.value = -1;
      return true;
    }
    return false;
  }
}
