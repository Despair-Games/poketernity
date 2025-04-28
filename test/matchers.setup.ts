import { toHaveEffectiveStatMatcher } from "#test/test-utils/matchers/to-have-effective-stat-matcher";
import { toHaveFullHpMatcher } from "#test/test-utils/matchers/to-have-full-hp-matcher";
import { toHaveMoveResultMatcher } from "#test/test-utils/matchers/to-have-move-result-matcher";
import { toHaveStatMatcher } from "#test/test-utils/matchers/to-have-stat-matcher";
import { toHaveStatusEffectMatcher } from "#test/test-utils/matchers/to-have-status-effect-matcher";
import { toHaveTakenDamageMatcher } from "#test/test-utils/matchers/to-have-taken-damage-matcher";
import { toHaveUsedMoveMatcher } from "#test/test-utils/matchers/to-have-used-move-matcher";
import { toHaveWeatherMatcher } from "#test/test-utils/matchers/to-have-weather-matcher";
import { expect } from "vitest";

/**
 * Setup for custom matchers.
 * Make sure to define the call signatures in {@linkcode file://./@types/vitest.d.ts} too!
 */

expect.extend({
  toHaveMoveResult: toHaveMoveResultMatcher,
  toHaveUsedMove: toHaveUsedMoveMatcher,
  toHaveStat: toHaveStatMatcher,
  toHaveEffectiveStat: toHaveEffectiveStatMatcher,
  toHaveTakenDamage: toHaveTakenDamageMatcher,
  toHaveWeather: toHaveWeatherMatcher,
  toHaveFullHp: toHaveFullHpMatcher,
  toHaveStatusEffect: toHaveStatusEffectMatcher,
});
