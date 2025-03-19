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
  constructor(limit: number, resetOnFail: boolean) {
    super((user: Pokemon, _target: Pokemon, move: Move): number => {
      const moveHistory = user.getLastXMoves(limit + 1).slice(1);

      let count = 0;
      let turnMove: TurnMove | undefined;

      while (
        (turnMove = moveHistory.shift())?.move.id === move.id
        && (!resetOnFail || turnMove?.result === MoveResult.SUCCESS)
      ) {
        if (count < limit - 1) {
          count++;
        } else {
          break;
        }
      }

      return this.getMultiplier(count);
    });
  }

  abstract getMultiplier(count: number): number;
}
