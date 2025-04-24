// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Pokemon } from "#app/field/pokemon";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

import type { MoveId } from "#enums/move-id";
import type { MoveResult } from "#enums/move-result";
import type { EffectiveStat, PermanentStat } from "#enums/stat";
import type { WeatherType } from "#enums/weather-type";
import type { ToHaveEffectiveStatMatcherOptions } from "#test/matchers/to-have-effective-stat-matcher";
import type { ToHaveMoveResultMatcherOptions } from "#test/matchers/to-have-move-result-matcher";
import type { ToHaveStatMatcherOptions } from "#test/matchers/to-have-stat-matcher";
import type { ToHaveUsedMoveMatcherOptions } from "#test/matchers/to-have-used-move-matcher";
import "vitest";

declare module "vitest" {
  interface Assertion {
    /**
     * Matcher to check if a pokemon's {@linkcode MoveResult} is as expected.
     *
     * CAUTION: This only checks one move used by the Pokemon (by default, the most recent move).
     * It does not check the Pokemon's entire move history.
     *
     * @param expected - The expected {@linkcode MoveResult}
     * @param options - The {@linkcode ToHaveMoveResultMatcherOptions} (optional)
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
     * @param options - The {@linkcode ToHaveUsedMoveMatcherOptions} (optional)
     * @see {@linkcode Pokemon.getLastXMoves}
     */
    toHaveUsedMove(expected: MoveId, options?: ToHaveUsedMoveMatcherOptions): void;

    /**
     * Matcher to check if a {@linkcode Pokemon} stat is as expected
     *
     * @param stat - The {@linkcode PermanentStat} to check
     * @param expectedValue - The expected value of the {@linkcode stat}
     * @param options - The {@linkcode ToHaveStatMatcherOptions} (optional)
     */
    toHaveStat(stat: PermanentStat, expectedValue: number, options?: ToHaveStatMatcherOptions): void;

    /**
     * Matcher to check if a {@linkcode Pokemon Pokemon's} effective stat is as expected
     *
     * *Effective stat means the stat after all the stat modifiers are applied.*
     *
     * @param stat - The {@linkcode EffectiveStat} to check
     * @param expectedValue - The expected value of the {@linkcode stat}
     * @param options - The {@linkcode ToHaveStatMatcherOptions} (optional)
     */
    toHaveEffectiveStat(stat: EffectiveStat, expectedValue: number, options?: ToHaveEffectiveStatMatcherOptions): void;

    /**
     * Matcher to check if a {@linkcode Pokemon} has taken a specific amount of damage
     * @param expectedDamageTaken The expected amount of damage the {@linkcode Pokemon} has taken
     */
    toHaveTakenDamage(expectedDamageTaken: number): void;

    /**
     * Matcher to check if the {@linkcode WeatherType} is as expected
     * @param expectedWeatherType - The expected {@linkcode WeatherType}
     */
    toHaveWeather(expectedWeatherType: WeatherType): void;

    /**
     * Matcher to check if a {@linkcode Pokemon} has full HP
     */
    toHaveFullHp(): void;
  }
}
