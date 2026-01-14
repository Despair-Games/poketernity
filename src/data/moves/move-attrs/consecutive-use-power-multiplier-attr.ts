import { MoveResult } from "#enums/move-result";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MovePowerMultiplierAttr } from "#moves/move-power-multiplier-attr";

/**
 * Abstract attribute to multiply move power based on the
 * number of times the move has been used consecutively and successfully by the user.
 */
export abstract class ConsecutiveUsePowerMultiplierAttr extends MovePowerMultiplierAttr {
  constructor(limit: number, resetOnFail: boolean) {
    super((user: Pokemon, _target: Pokemon, move: Move): number => {
      const moveHistory = user.getLastXMoves(limit + 1).slice(1);

      let count = 0;
      let turnMove = moveHistory.shift();

      while (turnMove?.move.id === move.id && (!resetOnFail || turnMove?.result === MoveResult.SUCCESS)) {
        if (count < limit - 1) {
          count++;
        } else {
          break;
        }
        turnMove = moveHistory.shift();
      }

      return this.getMultiplier(count);
    });
  }

  abstract getMultiplier(count: number): number;
}
