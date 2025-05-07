import { getPokemonNameWithAffix } from "#app/messages";
import { MoveId } from "#enums/move-id";
import { getEnemyMoveChoices } from "#test/ai/utils/enemy-command-utils";
import { isPokemonInstance, receivedStr } from "#test/test-utils/testUtils";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

/**
 * Matcher to check if an {@linkcode EnemyPokemon} prefers selecting a specific
 * move in the current game state
 * @param received - The object to check. Should be an {@linkcode EnemyPokemon}.
 * @param expectedMoveId - The {@linkcode MoveId} to check for.
 * @returns Whether the matcher passed, and the message to display in case of failure
 */
export function toPreferSelectingMoveMatcher(
  this: MatcherState,
  received: unknown,
  expectedMoveId: MoveId,
): SyncExpectationResult {
  if (!isPokemonInstance(received) || !received.isEnemy()) {
    return {
      pass: this.isNot,
      message: () => `Expected EnemyPokemon, but got ${receivedStr(received)}!`,
    };
  }

  const moveChoices = getEnemyMoveChoices(received);
  const preferredMoveId = Object.entries(moveChoices).reduce((prefMoveId, [moveId, count]) => {
    if (count > (moveChoices[prefMoveId] ?? 0)) {
      return parseInt(moveId);
    }
    return prefMoveId;
  }, MoveId.NONE);

  const pass = preferredMoveId === expectedMoveId;

  const pkmName = getPokemonNameWithAffix(received);
  const expectedMoveIdStr = `${MoveId[expectedMoveId]} (=${expectedMoveId})`;
  const preferredMoveIdStr = `${MoveId[preferredMoveId]} (=${preferredMoveId})`;

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${pkmName} to NOT prefer selecting ${expectedMoveIdStr}, but it does!`
        : `Expected ${pkmName} to prefer selecting ${expectedMoveIdStr}, but it prefers selecting ${preferredMoveIdStr} instead!`,
  };
}
