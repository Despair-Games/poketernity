import { MoveResult } from "#enums/move-result";
import { isPokemonInstance, receivedStr } from "#test/test-utils/test-utils";
import { enumValueToKey } from "#utils/common-utils";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

//#region Types

export interface ToHaveMoveResultMatcherOptions {
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
 * Matcher to check if a pokemons move result is as expected
 * @param received The actual value received
 * @param expectedValue The expected value
 * @param index The index of the move to check
 * @returns Whether the matcher passed
 */
export function toHaveMoveResultMatcher(
  this: MatcherState,
  received: unknown,
  expectedResult: MoveResult,
  { index = 0, moveCount = 1 }: ToHaveMoveResultMatcherOptions = {},
): SyncExpectationResult {
  if (!isPokemonInstance(received)) {
    return {
      pass: this.isNot,
      message: () => `Expected Pokemon, but got ${receivedStr(received)}!`,
    };
  }

  const moves = received.getLastXMoves(moveCount);
  const move = moves?.[index];
  const pass = move?.result === expectedResult;

  const moveIndexStr = index === 0 ? "latest move" : `move no. ${index}`;
  const expectedResultStr = `${enumValueToKey(MoveResult, expectedResult)} (=${expectedResult})`;
  const actualResultStr = move.result ? `${enumValueToKey(MoveResult, move.result)} (=${move.result})` : "undefined";

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${moveIndexStr} NOT to have result: ${expectedResultStr}, but it did.`
        : `Expected ${moveIndexStr} to have result: ${expectedResultStr}, but got: ${actualResultStr}.`,
  };
}

//#endregion
