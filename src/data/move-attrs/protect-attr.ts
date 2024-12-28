import { type TurnMove, MoveResult } from "#app/field/pokemon";
import { BattlerTagType } from "#enums/battler-tag-type";
import { Moves } from "#enums/moves";
import { allMoves } from "#app/data/all-moves";
import type { MoveConditionFunc } from "../move-conditions";
import { AddBattlerTagAttr } from "./add-battler-tag-attr";

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
        if (!allMoves[turnMove?.move ?? Moves.NONE].hasAttr(ProtectAttr) || turnMove?.result !== MoveResult.SUCCESS) {
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
