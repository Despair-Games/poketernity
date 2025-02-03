import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import { allMoves } from "#app/data/all-moves";
import { MoveResult } from "#enums/move-result";

/**
 * TODO: review this
 */
export const targetMoveCopiableCondition: MoveConditionFunc = (_user, target, _move) => {
  const targetMoves = target.getMoveHistory().filter((m) => !m.virtual);
  if (!targetMoves.length) {
    return false;
  }

  const copiableMove = targetMoves[0];

  if (!copiableMove.moveId) {
    return false;
  }

  if (allMoves[copiableMove.moveId].isChargingMove() && copiableMove.result === MoveResult.OTHER) {
    return false;
  }

  // TODO: Add last turn of Bide
  return true;
};
