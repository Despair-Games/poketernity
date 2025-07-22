/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { ProtectAttr } from "#moves/protect-attr";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import { PROTECT_MOVES } from "#constants/move-constants";
import { MoveResult } from "#enums/move-result";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveCondition } from "#moves/move-condition";
import type { MoveConditionFunc } from "#types/move-condition-func";

/**
 * Condition for {@link https://bulbapedia.bulbagarden.net/wiki/Protect_(move) | Protect}
 * and its variations. Decreases the chance of success
 * by a factor of 1/3 for every consecutive successful use
 * of a Protect variation.
 * @extends MoveCondition
 */
export class ProtectCondition extends MoveCondition {
  constructor() {
    super(protectCondition);
  }

  /**
   * This condition does not contribute to score.
   * Instead, consecutive use of Protect and similar moves is discouraged
   * by the moves' {@linkcode ProtectAttr.getRawEffectScore | Effect Score functions}.
   */
  public override getConditionScore(_user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    return 0;
  }
}

const protectCondition: MoveConditionFunc = (user, _target, _move) => {
  const moveHistory = user.getLastXMoves(-1).filter((mv) => !mv.virtual);
  /**
   * The index of the last move in the user's move history that either failed
   * or is not a variation of Protect
   *
   * @privateRemarks
   * This cannot check if the move has a {@linkcode ProtectAttr}; doing so would create a circular dependency.
   */
  const lastNonUse = moveHistory.findIndex(
    (mv) => mv.result !== MoveResult.SUCCESS || !PROTECT_MOVES.includes(mv.move.id),
  );

  if (lastNonUse === -1) {
    return !user.randSeedInt(Math.pow(3, moveHistory.length));
  }
  return !user.randSeedInt(Math.pow(3, lastNonUse));
};
