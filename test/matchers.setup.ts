import { toHaveEffectiveStatMatcher } from "#test/matchers/to-have-effective-stat-matcher";
import { toHaveMoveResult } from "#test/matchers/to-have-move-result";
import { toHaveStatMatcher } from "#test/matchers/to-have-stat-matcher";
import { toHaveUsedMove } from "#test/matchers/to-have-used-move";
import { expect } from "vitest";

/**
 * Setup for custom matchers.
 * Make sure to define the call signatures in {@linkcode file://./@types/vitest.d.ts} too!
 */

expect.extend({
  toHaveMoveResult,
  toHaveUsedMove,
  toHaveStat: toHaveStatMatcher,
  toHaveEffectiveStat: toHaveEffectiveStatMatcher,
});
