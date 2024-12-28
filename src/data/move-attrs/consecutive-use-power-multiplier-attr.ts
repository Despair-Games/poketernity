import { Moves } from "#enums/moves";
import { type Pokemon, type TurnMove, MoveResult } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { MovePowerMultiplierAttr } from "#app/data/move-attrs/move-power-multiplier-attr";

export abstract class ConsecutiveUsePowerMultiplierAttr extends MovePowerMultiplierAttr {
  constructor(limit: number, resetOnFail: boolean, resetOnLimit?: boolean, ...comboMoves: Moves[]) {
    super((user: Pokemon, _target: Pokemon, move: Move): number => {
      const moveHistory = user.getLastXMoves(limit + 1).slice(1);

      let count = 0;
      let turnMove: TurnMove | undefined;

      while (
        ((turnMove = moveHistory.shift())?.move === move.id
          || (comboMoves.length && comboMoves.includes(turnMove?.move ?? Moves.NONE)))
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
