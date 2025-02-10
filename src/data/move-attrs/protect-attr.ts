import { type TurnMove } from "#app/@types/TurnMove";
import { MoveResult } from "#enums/move-result";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import { AddBattlerTagAttr } from "./add-battler-tag-attr";

/**
 * Attribute to apply a set type of protection to the user.
 * Moves with this attribute have an increased chance of failing after
 * consecutive uses.
 * @extends AddBattlerTagAttr
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Move_variations#Variations_of_Protect | Variations of Protect}
 */
export class ProtectAttr extends AddBattlerTagAttr {
  constructor(tagType: BattlerTagType = BattlerTagType.PROTECTED) {
    super(tagType, true);
  }

  override getCondition(): MoveConditionFunc {
    return (user, _target, _move): boolean => {
      let timesUsed = 0;
      const moveHistory = user.getLastXMoves();
      let turnMove: TurnMove | undefined;

      while (moveHistory.length) {
        turnMove = moveHistory.shift();
        if (!turnMove?.move?.hasAttr(ProtectAttr) || turnMove?.result !== MoveResult.SUCCESS) {
          break;
        }
        timesUsed++;
      }
      if (timesUsed) {
        return !user.randSeedInt(Math.pow(3, timesUsed));
      }
      return true;
    };
  }
}
