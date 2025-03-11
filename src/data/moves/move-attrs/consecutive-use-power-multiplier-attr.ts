import { MoveId } from "#enums/move-id";
import { type Pokemon } from "#app/field/pokemon";
import { type TurnMove } from "#app/@types/TurnMove";
import { MoveResult } from "#enums/move-result";
import type { Move } from "#app/data/moves/move";
import { MovePowerMultiplierAttr } from "#app/data/moves/move-attrs/move-power-multiplier-attr";

/**
 * Abstract attribute to multiply move power based on the
 * number of times the move has been used consecutively and successfully by the user.
 * @extends MovePowerMultiplierAttr
 */
export abstract class ConsecutiveUsePowerMultiplierAttr extends MovePowerMultiplierAttr {
  constructor(limit: number, resetOnFail: boolean, resetOnLimit?: boolean, ...comboMoves: MoveId[]) {
    super((user: Pokemon, _target: Pokemon, move: Move): number => {
      const moveHistory = user.getLastXMoves(limit + 1).slice(1);

      let count = 0;
      let turnMove: TurnMove | undefined;

      while (
        ((turnMove = moveHistory.shift())?.move.id === move.id
          || (comboMoves.length && comboMoves.includes(turnMove?.move.id ?? MoveId.NONE)))
        && (!resetOnFail || turnMove?.result === MoveResult.SUCCESS)
      ) {
        if (count < limit - 1) {
          count++;
        } else if (resetOnLimit) {
          count = 0;
        } else {
          break;
        }
      }

      return this.getMultiplier(count);
    });
  }

  abstract getMultiplier(count: number): number;
}
