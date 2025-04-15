// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Pokemon } from "#app/field/pokemon";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

import type { MoveId } from "#enums/move-id";
import type { MoveResult } from "#enums/move-result";
import type { ToHaveMoveResultMatcherOptions } from "#test/matchers/to-have-move-result";
import type { ToHaveUsedMoveMatcherOptions } from "#test/matchers/to-have-used-move";
import "vitest";

declare module "vitest" {
  interface Assertion {
    /**
     * Matcher to check if a pokemons {@linkcode MoveResult} is as expected
     * @param expected The expected {@linkcode MoveResult}
     * @param options The {@linkcode ToHaveMoveResultMatcherOptions} (optional)
     * @see {@linkcode Pokemon.getLastXMoves}
     */
    toHaveMoveResult(expected: MoveResult, options?: ToHaveMoveResultMatcherOptions): void;

    /**
     * Matcher to check if a pokemons used a move with a certain {@linkcode MoveId}
     * @param expected The expected {@linkcode MoveId}
     * @param options The {@linkcode ToHaveUsedMoveMatcherOptions} (optional)
     * @see {@linkcode Pokemon.getLastXMoves}
     */
    toHaveUsedMove(expected: MoveId, options?: ToHaveUsedMoveMatcherOptions): void;
  }
}
