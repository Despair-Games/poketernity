import { MoveId } from "#enums/move-id";
import { isPokemonInstance, receivedStr } from "#test/test-utils/testUtils";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

//#region Types

export interface ToHaveUsedMoveMatcherOptions {
  /** The index of the move to check (Default is `0`) */
  index?: number;
  /**
   * The number of move entries to retrieve (Default is `1`).
   * If negative, retrieve the Pokemon's entire move history (equivalent to reversing the output of {@linkcode getMoveHistory()}).
   * @see {@linkcode Pokemon.getLastXMoves}
   */
  moveCount?: number;
}

//#endregion
//#region Exports

/**
 * Matcher to check if a pokemons move id is as expected
 * @param received The actual value received
 * @param expectedValue The expected value
 * @param index The index of the move to check
 * @returns Whether the matcher passed
 */
export function toHaveUsedMoveMatcher(
  this: MatcherState,
  received: unknown,
  expectedResult: MoveId,
  { index = 0, moveCount = 1 }: ToHaveUsedMoveMatcherOptions = {},
): SyncExpectationResult {
  if (!isPokemonInstance(received)) {
    return {
      pass: this.isNot,
      message: () => `Expected Pokemon, but got ${receivedStr(received)}!`,
    };
  }

  const turnMove = received.getLastXMoves(moveCount);
  const move = turnMove?.[index];
  const pass = move?.move.id === expectedResult;

  const moveIndexStr = index === 0 ? "latest move" : `move no. ${index}`;

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${moveIndexStr} NOT to have id: ${MoveId[expectedResult]} (=${expectedResult}), but it did.`
        : `Expected ${moveIndexStr} to have id: ${MoveId[expectedResult]} (=${expectedResult}), but got: ${
            move?.move.id ? `${MoveId[move.move.id]} (=${move.move.id})` : "undefined"
          }`,
  };
}

//#endregion
