import { globalScene } from "#app/global-scene";
import { BAD_MOVE_PENALTY } from "#constants/ai-constants";
import { BattleCommand } from "#enums/battle-command";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveCondition } from "#moves/move-condition";

/**
 * Condition used by the move {@link https://bulbapedia.bulbagarden.net/wiki/Upper_Hand_(move) | Upper Hand}.
 * Moves with this condition are only successful when the target has selected
 * a high-priority attack (after factoring in priority-boosting effects) and
 * hasn't moved yet this turn.
 */
export class UpperHandCondition extends MoveCondition {
  constructor() {
    super((_user, target, _move) => {
      const targetCommand = globalScene.currentBattle.turnManager.findCommandFromPokemon(target);

      return (
        targetCommand?.command === BattleCommand.FIGHT
        && !target.turnData.acted
        && !!targetCommand.turnMove?.move.isAttackMove()
        && targetCommand.turnMove.move.getPriority(target) > 0
      );
    });
  }

  /**
   * Grants (-1) if the target's best attack against the user has a priority greater
   * than 0. The target's best attack is determined from their {@linkcode Pokemon.estimateAttackMoves | estimated moveset}
   * based on each move's {@linkcode Pokemon.getExpectedAttackScore | EAS} against the user.
   */
  public override getConditionScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    const targetEstMoves = target.estimateAttackMoves();
    const highestEASMove = targetEstMoves.reduce(
      ({ bestMove, bestScore }, currMove) => {
        const eas = target.getExpectedAttackScore(user, currMove);
        return eas > bestScore
          ? {
              bestMove: currMove,
              bestScore: eas,
            }
          : {
              bestMove,
              bestScore,
            };
      },
      {
        bestMove: null,
        bestScore: 0,
      },
    );

    const { bestMove } = highestEASMove;
    return !!bestMove && bestMove.getPriority(target) > 0 ? -1 : BAD_MOVE_PENALTY;
  }
}
