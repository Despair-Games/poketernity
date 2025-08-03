import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import type { MoveConditionFunc } from "#types/move-types";

/**
 * TODO: review this
 */
export const targetMoveCopiableCondition: MoveConditionFunc = (_user, target, _move) => {
  const targetMoves = target.getMoveHistory().filter((m) => !m.virtual);
  if (!targetMoves.length) {
    return false;
  }

  const copiableMove = targetMoves[0];

  if (!copiableMove.move.id) {
    return false;
  }

  if (copiableMove.move?.isChargingMove() && copiableMove.result === MoveResult.OTHER) {
    return false;
  }

  /**
   * Bide can only be copied after it fully executes
   * @todo Verify this interaction (on Showdown?)
   */
  if (copiableMove.move.id === MoveId.BIDE && target.hasTag(BattlerTagType.BIDE)) {
    return false;
  }

  return true;
};
