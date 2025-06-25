// -- start tsdoc imports --
/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { Pokemon } from "#field/pokemon";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */
// -- end tsdoc imports --

import type { AbilityId } from "#enums/ability-id";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { MoveId } from "#enums/move-id";
import type { MoveResult } from "#enums/move-result";
import type { EffectiveStat, PermanentStat, Stat } from "#enums/stat";
import type { StatusEffect } from "#enums/status-effect";
import type { TerrainType } from "#enums/terrain-type";
import type { WeatherType } from "#enums/weather-type";
import type { ToHaveEffectiveStatMatcherOptions } from "#test/test-utils/matchers/to-have-effective-stat-matcher";
import type { ToHaveMoveResultMatcherOptions } from "#test/test-utils/matchers/to-have-move-result-matcher";
import type { ToHaveStatMatcherOptions } from "#test/test-utils/matchers/to-have-stat-matcher";
import type { ToHaveStatusEffectMatcherOptions } from "#test/test-utils/matchers/to-have-status-effect-matcher";
import type { ToHaveUsedMoveMatcherOptions } from "#test/test-utils/matchers/to-have-used-move-matcher";
import "vitest";
import type { ToHaveTakenDamageMatcherOptions } from "#test/test-utils/matchers/to-have-taken-damage-matcher";

declare module "vitest" {
  interface Assertion {
    /**
     * Matcher to check if a pokemon's {@linkcode MoveResult} is as expected.
     *
     * CAUTION: This only checks one move used by the Pokemon (by default, the most recent move).
     * It does not check the Pokemon's entire move history.
     *
     * @param expected - The expected {@linkcode MoveResult}
     * @param options - (Optional) The {@linkcode ToHaveMoveResultMatcherOptions}
     * @see {@linkcode Pokemon.getLastXMoves}
     */
    toHaveMoveResult(expected: MoveResult, options?: ToHaveMoveResultMatcherOptions): void;

    /**
     * Matcher to check if a pokemon used a move with a certain {@linkcode MoveId}.
     *
     * CAUTION: This only checks one move used by the Pokemon (by default, the most recent move).
     * It does not check the Pokemon's entire move history.
     *
     * @param expected - The expected {@linkcode MoveId}
     * @param options - (Optional) The {@linkcode ToHaveUsedMoveMatcherOptions}
     * @see {@linkcode Pokemon.getLastXMoves}
     */
    toHaveUsedMove(expected: MoveId, options?: ToHaveUsedMoveMatcherOptions): void;

    /**
     * Matcher to check if a {@linkcode Pokemon} stat is as expected
     *
     * _Stat means the stat before modifiers are applied._
     * _If you want to check the stat **after** modifiers are applied, use {@linkcode toHaveEffectiveStat}._
     *
     * @param stat - The {@linkcode PermanentStat} to check
     * @param expectedValue - The expected value of the {@linkcode stat}
     * @param options - The {@linkcode ToHaveStatMatcherOptions} (optional)
     */
    toHaveStat(stat: PermanentStat, expectedValue: number, options?: ToHaveStatMatcherOptions): void;

    /**
     * Matcher to check if a {@linkcode Pokemon Pokemon's} effective stat is as expected
     *
     * _Effective stat means the stat after all the stat modifiers are applied._
     * _If you want to check the stat **before** modifiers are applied, use {@linkcode toHaveStat}._
     *
     * @param stat - The {@linkcode EffectiveStat} to check
     * @param expectedValue - The expected value of the {@linkcode stat}
     * @param options - (Optional) The {@linkcode ToHaveEffectiveStatMatcherOptions}
     */
    toHaveEffectiveStat(stat: EffectiveStat, expectedValue: number, options?: ToHaveEffectiveStatMatcherOptions): void;

    /**
     * Matcher to check if a {@linkcode Pokemon} has taken a specific amount of damage
     * @param expectedDamageTaken The expected amount of damage the {@linkcode Pokemon} has taken
     * @param options - (Optional) The {@linkcode ToHaveTakenDamageMatcherOptions}
     */
    toHaveTakenDamage(expectedDamageTaken: number, options?: ToHaveTakenDamageMatcherOptions): void;

    /**
     * Matcher to check if a {@linkcode Pokemon} has a specific non-volatile status effect
     * @param expectedStatusEffect - The expected {@linkcode StatusEffect}
     * @param options - (Optional) The {@linkcode ToHaveStatusEffectMatcherOptions}
     */
    toHaveStatusEffect(expectedStatusEffect: StatusEffect, options?: ToHaveStatusEffectMatcherOptions): void;

    /**
     * Matcher to check if the {@linkcode WeatherType} is as expected
     * @param expectedWeatherType - The expected {@linkcode WeatherType}
     */
    toHaveWeather(expectedWeatherType: WeatherType): void;

    /**
     * Matcher to check if the {@linkcode TerrainType} is as expected
     * @param expectedTerrainType - The expected {@linkcode TerrainType}
     */
    toHaveTerrain(expectedTerrainType: TerrainType): void;

    /**
     * Matcher to check if a {@linkcode Pokemon} has full HP
     */
    toHaveFullHp(): void;

    /**
     * Matcher to check if a {@linkcode Pokemon} has a specific {@linkcode Stats} stage.
     * @param stat - The {@linkcode Stat} to check
     * @param expectedStage - The expected stage of the {@linkcode stat}
     */
    toHaveStatStage(stat: Stat, expectedStage: number): void;

    /**
     * Matcher to check if a {@linkcode Pokemon} has a specific {@linkcode BattlerTagType}.
     * @param expectedBattlerTagType - The expected {@linkcode BattlerTagType}.
     */
    toHaveBattlerTag(expectedBattlerTagType: BattlerTagType): void;

    /**
     * Matcher to check if a {@linkcode Pokemon} had a specific {@linkcode AbilityId} applied.
     * @param expectedAbilityId - The expected {@linkcode AbilityId}.
     */
    toHaveAbilityApplied(expectedAbilityId: AbilityId): void;

    /**
     * Matcher to check if a {@linkcode Pokemon} has a specific amount of HP.
     */
    toHaveHp(expectedHp: number): void;

    /**
     * Matcher to check if a {@linkcode Pokemon} has fainted.
     *
     * _Includes a check for hp being `0`._
     */
    toHaveFainted(): void;
  }
}
