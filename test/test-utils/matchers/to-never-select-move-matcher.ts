import { getPokemonNameWithAffix } from "#app/messages";
import { MoveId } from "#enums/move-id";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Move } from "#moves/move";
import { getEnemyMoveChoices } from "#test/test-utils/enemy-command-utils";
import { isPokemonInstance, receivedStr } from "#test/test-utils/test-utils";
import { coerceArray } from "#utils/common-utils";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

/**
 * A qualifier for a matcher to apply to certain moves in a Pokemon's moveset.
 * Currently, this is only used for {@linkcode toNeverSelectMoveMatcher}.
 * Supports three types of input:
 * - A {@linkcode MoveId} or Array of MoveIds to qualify moves whose ID matches
 * at least one of the given IDs
 * - A condition function with a {@linkcode Move} input, which can be used
 * to filter moves by their base properties.
 */
export type MoveQualifier = MoveId | MoveId[] | ((move: Move) => boolean);

/**
 * Matcher to check if an enemy Pokemon never selects a move in
 * the current battle state over several random trials.
 * @param received - The object to check. Must be an {@linkcode EnemyPokemon}
 * @param qualifier - Can be any of the following:
 * - A {@linkcode MoveId} to check if a single move is never used
 * - A {@linkcode MoveId} array to check if all moves in the array are never used
 * - A condition function to check if all moves that meet the condition in
 * the enemy's moveset are never used
 * @returns the results of the matcher's assertion
 * @see {@linkcode getEnemyMoveChoices}
 */
export function toNeverSelectMoveMatcher(
  this: MatcherState,
  received: unknown,
  qualifier: MoveQualifier,
): SyncExpectationResult {
  if (!isPokemonInstance(received) || !received.isEnemy()) {
    return {
      pass: this.isNot,
      message: () => `Expected EnemyPokemon, but got ${receivedStr(received)}!`,
    };
  }

  const expectedUnusedMoveIds = getExpectedUnusedMoveIds(received, qualifier);
  const moveChoices = getEnemyMoveChoices(received);
  const actualUnusedMoveIds = Object.entries(moveChoices)
    .filter(([, count]) => count === 0)
    .map(([moveId]) => Number.parseInt(moveId));

  const errorMoveIds = expectedUnusedMoveIds.filter((mvId) => !actualUnusedMoveIds.includes(mvId));
  const invErrorMoveIds = expectedUnusedMoveIds.filter((mvId) => !errorMoveIds.includes(mvId));

  const pass = errorMoveIds.length === 0;

  const pkmName = getPokemonNameWithAffix(received);

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${pkmName} to select ${invErrorMoveIds.map((mvId) => MoveId[mvId]).join()} at least once, but it never did!`
        : `Expected ${pkmName} to never select ${errorMoveIds.map((mvId) => MoveId[mvId]).join()}, but it did!`,
  };
}

function getExpectedUnusedMoveIds(pokemon: EnemyPokemon, qualifier: MoveQualifier): MoveId[] {
  const enemyMoveset = pokemon.getMoveset();
  if (typeof qualifier === "function") {
    return enemyMoveset.filter((mv) => qualifier(mv.getMove())).map((mv) => mv.moveId);
  }
  return coerceArray(qualifier);
}
