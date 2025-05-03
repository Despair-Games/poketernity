import type { Move } from "#app/data/moves/move";
import type { EnemyPokemon } from "#app/field/enemy-pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import { MoveId } from "#enums/move-id";
import { getEnemyMoveChoices } from "#test/ai/utils/enemy-command-utils";
import { isPokemonInstance, receivedStr } from "#test/test-utils/testUtils";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

export type MoveQualifier = MoveId | MoveId[] | ((move: Move) => boolean);

function getExpectedUnusedMoveIds(pokemon: EnemyPokemon, qualifier: MoveQualifier): MoveId[] {
  const enemyMoveset = pokemon.getMoveset();
  if (typeof qualifier === "function") {
    return enemyMoveset.filter((mv) => qualifier(mv.getMove())).map((mv) => mv.moveId);
  }

  /** @todo replace with `coerceArray` util */
  return Array.isArray(qualifier) ? [...qualifier] : [qualifier];
}

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
    .map(([moveId]) => parseInt(moveId));

  const errorMoveIds = expectedUnusedMoveIds.filter((mvId) => !actualUnusedMoveIds.includes(mvId));
  const invErrorMoveIds = expectedUnusedMoveIds.filter((mvId) => !errorMoveIds.includes(mvId));

  const pass = errorMoveIds.length === 0;

  const pkmName = getPokemonNameWithAffix(received);

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${pkmName} to select ${invErrorMoveIds.map((mvId) => MoveId[mvId])} at least once, but it never did!`
        : `Expected ${pkmName} to never select ${errorMoveIds.map((mvId) => MoveId[mvId])}, but it did!`,
  };
}
