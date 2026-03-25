import { toBeAtPhase } from "#test/test-utils/matchers/to-be-at-phase";
import { toEqualUnsorted } from "#test/test-utils/matchers/to-equal-unsorted";
import { toHaveAbilityApplied } from "#test/test-utils/matchers/to-have-ability-applied";
import { toHaveArenaTag } from "#test/test-utils/matchers/to-have-arena-tag";
import { toHaveBattlerTag } from "#test/test-utils/matchers/to-have-battler-tag";
import { toHaveEffectiveStat } from "#test/test-utils/matchers/to-have-effective-stat-matcher";
import { toHaveFainted } from "#test/test-utils/matchers/to-have-fainted";
import { toHaveFullHp } from "#test/test-utils/matchers/to-have-full-hp";
import { toHaveHp } from "#test/test-utils/matchers/to-have-hp-matcher";
import { toHaveKey } from "#test/test-utils/matchers/to-have-key";
import { toHaveShownMessage } from "#test/test-utils/matchers/to-have-shown-message";
import { toHaveStat } from "#test/test-utils/matchers/to-have-stat-matcher";
import { toHaveStatStage } from "#test/test-utils/matchers/to-have-stat-stage-matcher";
import { toHaveStatusEffect } from "#test/test-utils/matchers/to-have-status-effect-matcher";
import { toHaveTakenDamage } from "#test/test-utils/matchers/to-have-taken-damage-matcher";
import { toHaveTerrain } from "#test/test-utils/matchers/to-have-terrain-matcher";
import { toHaveTypes } from "#test/test-utils/matchers/to-have-types";
import { toHaveUsedMove } from "#test/test-utils/matchers/to-have-used-move-matcher";
import { toHaveUsedPP } from "#test/test-utils/matchers/to-have-used-pp";
import { toHaveWeather } from "#test/test-utils/matchers/to-have-weather-matcher";
import { expect } from "vitest";

/*
 * Setup for custom matchers.
 * Make sure to define the call signatures in `test/@types/vitest.d.ts` too!
 */

expect.extend({
  toBeAtPhase,
  toEqualUnsorted,
  toHaveAbilityApplied,
  toHaveArenaTag,
  toHaveBattlerTag,
  toHaveEffectiveStat,
  toHaveFainted,
  toHaveFullHp,
  toHaveHp,
  toHaveKey,
  toHaveShownMessage,
  toHaveStat,
  toHaveStatStage,
  toHaveStatusEffect,
  toHaveTakenDamage,
  toHaveTerrain,
  toHaveTypes,
  toHaveUsedMove,
  toHaveUsedPP,
  toHaveWeather,
});
