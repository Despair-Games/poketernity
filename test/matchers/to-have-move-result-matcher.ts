import type { Pokemon } from "#app/field/pokemon";
import { MoveResult } from "#enums/move-result";

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

/**
 * Matcher to check if a pokemons move result is as expected
 * @param received The actual value received
 * @param expectedValue The expected value
 * @param index The index of the move to check
 * @returns Whether the matcher passed
 */
export function toHaveMoveResultMatcher(
  received: unknown,
  expectedResult: MoveResult,
  { index = 0, moveCount = 1 }: ToHaveMoveResultMatcherOptions = {},
) {
  if (typeof received !== "object" || received === null || typeof (received as any).getLastXMoves !== "function") {
    return {
      pass: false,
      message: () => `Expected object with method 'getLastXMoves()', but got: ${typeof received}`,
    };
  }

  const moves = (received as Pokemon).getLastXMoves(moveCount);
  const move = moves?.[index];
  const pass = move?.result === expectedResult;

  const moveIndexStr = index === 0 ? "latest move" : `move no. ${index}`;

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${moveIndexStr} NOT to have result: ${MoveResult[expectedResult]} (=${expectedResult}), but it did.`
        : `Expected ${moveIndexStr} to have result: ${MoveResult[expectedResult]} (=${expectedResult}), but got: ${
            move?.result ? `${MoveResult[move.result]} (=${move.result})` : "undefined"
          }`,
  };
}
