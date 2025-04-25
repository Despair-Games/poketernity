import { toHaveEffectiveStatMatcher } from "#test/matchers/to-have-effective-stat-matcher";
import { toHaveFullHpMatcher } from "#test/matchers/to-have-full-hp-matcher";
import { toHaveMoveResultMatcher } from "#test/matchers/to-have-move-result-matcher";
import { toHaveStatMatcher } from "#test/matchers/to-have-stat-matcher";
import { toHaveTakenDamageMatcher } from "#test/matchers/to-have-taken-damage-matcher";
import { toHaveUsedMoveMatcher } from "#test/matchers/to-have-used-move-matcher";
import { toHaveWeatherMatcher } from "#test/matchers/to-have-weather-matcher";
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
});
