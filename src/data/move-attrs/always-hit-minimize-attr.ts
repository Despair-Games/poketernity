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
  /**
   * @see {@linkcode apply}
   * @param _user N/A
   * @param target {@linkcode Pokemon} target of the move
   * @param _move N/A
   * @param args [0] Accuracy of the move to be modified
   * @returns true if the function succeeds
   */
  override apply(_user: Pokemon, target: Pokemon, _move: Move, args: any[]): boolean {
    if (target.getTag(BattlerTagType.MINIMIZED)) {
      const accuracy = args[0] as NumberHolder;
      accuracy.value = -1;

      return true;
    }

    return false;
  }
}
