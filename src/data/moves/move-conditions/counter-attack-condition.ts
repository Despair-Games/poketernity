/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { MoveId } from "#enums/move-id";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import { BAD_MOVE_PENALTY, KO_ATTACK_SCORE } from "#constants/ai-constants";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveCondition } from "#moves/move-condition";
import type { MoveFilter } from "#types/move-filter";

export class CounterAttackCondition extends MoveCondition {
  private readonly moveFilter: MoveFilter;

  constructor(moveFilter: MoveFilter) {
    super((user, _target, _move) => user.turnData.attacksReceived.some((ar) => moveFilter(ar.moveId)));
    this.moveFilter = moveFilter;
  }

  /**
   * Grants no penalty if neither of the user's opponents can KO the user
   * (based on {@link Pokemon.estimateAttackMoves | estimated attacks}), and any of
   * the user's opponents have a move that meets the conditions to counter-attack.
   * Otherwise, this grants a {@link BAD_MOVE_PENALTY | Bad Move Penalty}.
   */
  public override getConditionScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    const opponents = user.getOpponents();

    /**
     * The opponents' forecasted Attack Scores as an array of {@linkcode MoveId}-score pairs, e.g.
     * ```
     * [
     *   [MoveId.TACKLE, 1],
     *   [MoveId.ICE_BEAM, 2],
     *   [MoveId.THUNDERBOLT, 4]
     * ]
     * ```
     */
    const expAttackScores = opponents.flatMap((opp) =>
      opp.estimateAttackMoves().map((mv) => [mv.id, opp.getExpectedAttackScore(user, mv)]),
    );

    if (
      expAttackScores.every(([, score]) => score < KO_ATTACK_SCORE)
      && expAttackScores.some(([moveId]) => this.moveFilter(moveId))
    ) {
      return 0;
    }

    return BAD_MOVE_PENALTY;
  }
}
