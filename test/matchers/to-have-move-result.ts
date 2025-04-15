import type { TurnMove } from "#app/@types/TurnMove";
import { MoveResult } from "#enums/move-result";

/**
 * Matcher to check if a pokemons move result is as expected
 * @param received The actual value received
 * @param expectedValue The expected value
 * @param index The index of the move to check
 * @returns Whether the matcher passed
 */
export const toHaveMoveResult = (received: unknown, expectedResult: MoveResult, index = 0) => {
  if (typeof received !== "object" || received === null || typeof (received as any).getLastXMoves !== "function") {
    return {
      pass: false,
      message: () => `Expected object with method 'getLastXMoves()', but got: ${typeof received}`,
    };
  }

  const moves = (received as { getLastXMoves: () => TurnMove[] }).getLastXMoves();
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
};
