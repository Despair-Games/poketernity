import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveResult } from "#enums/move-result";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { MoveConditionFunc } from "#types/move-types";

/**
 * Attribute to apply a set type of protection to the user.
 *
 * Moves with this attribute have an increased chance of failing after
 * consecutive uses:
 *
 * | Uses **\|** | Success Rate |
 * |:-----------:|:------------:|
 * |     0       |      1       |
 * |     1       |    1/3       |
 * |     2       |    1/9       |
 * |     3       |   1/27       |
 * |     4       |    ...       |
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Move_variations#Variations_of_Protect | Variations of Protect}
 */
export class ProtectAttr extends AddBattlerTagAttr {
  constructor(tagType: BattlerTagType = BattlerTagType.PROTECTED) {
    super(tagType, true);
  }

  override getCondition(): MoveConditionFunc {
    return (user, _target, _move): boolean => {
      const moveHistory = user.getLastXMoves(-1).filter((mv) => !mv.virtual);
      const lastNonUse = moveHistory.findIndex(
        (mv) => mv.result !== MoveResult.SUCCESS || !mv.move.hasAttr(ProtectAttr),
      );

      if (lastNonUse === -1) {
        return !user.randSeedInt(Math.pow(3, moveHistory.length));
      }
      return !user.randSeedInt(Math.pow(3, lastNonUse));
    };
  }
}
