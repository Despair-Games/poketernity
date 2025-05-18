import { MoveResult } from "#enums/move-result";
import type { MoveConditionFunc } from "#types/MoveConditionFunc";

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

  return true;
};
