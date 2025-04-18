import { toHaveMoveResultMatcher } from "#test/matchers/to-have-move-result-matcher";
import { toHaveUsedMoveMatcher } from "#test/matchers/to-have-used-move-matcher";
import { expect } from "vitest";

/**
 * Setup for custom matchers.
 * Make sure to define the call signatures in {@linkcode file://./@types/vitest.d.ts} too!
 */

expect.extend({
  toHaveMoveResult: toHaveMoveResultMatcher,
  toHaveUsedMove: toHaveUsedMoveMatcher,
});
