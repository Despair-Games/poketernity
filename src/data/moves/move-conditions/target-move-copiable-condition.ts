import { MoveResult } from "#enums/move-result";
import type { MoveConditionFunc } from "#types/move-types";

/**
 * Condition function requiring the target's last-used move to be copiable,
 * e.g. for {@link https://bulbapedia.bulbagarden.net/wiki/Copycat_(move) | Copycat}
 * @param _user - (Unused) The {@linkcode Pokemon} using the move
 * @param target - The {@linkcode Pokemon} targeted by the move
 * @param _move - The {@linkcode Move} being used
 * @returns `true` if the condition is met
 */
export const targetMoveCopiableCondition: MoveConditionFunc = (_user, target, _move) => {
  const targetMoves = target.getMoveHistory().filter((m) => !m.virtual);
  if (targetMoves.length === 0) {
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
