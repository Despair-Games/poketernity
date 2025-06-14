// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { PokemonTurnData } from "#types/pokemon-turn-data";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

import type { MoveId } from "#enums/move-id";

/**
 * Caches invariant data for the Enemy AI to reuse
 * during its score calculations for turn action selection against
 * a "target" {@linkcode Pokemon}. This is stored within a "source"
 * Pokemon's {@linkcode PokemonTurnData}, and is thus reset at the start of each turn.
 */
export interface PokemonScoreData {
  /**
   * A score for grading the source Pokemon's matchup against
   * the target Pokemon.
   * @see {@linkcode EnemyPokemon.getMatchupScore}
   */
  matchupScore?: number;
  /**
   * The expected values of the source Pokemon's Attack Scores
   * against the target Pokemon for each of the source's moves.
   * @see {@linkcode Pokemon.getExpectedAttackScore}
   */
  expectedAttackScores: Map<MoveId, number>;
}
