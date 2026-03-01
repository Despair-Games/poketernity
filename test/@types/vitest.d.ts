import "vitest";

import type { activeOverrides } from "#app/overrides";
import type { Phase } from "#app/phase";
import type { AbilityId } from "#enums/ability-id";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import type { ArenaTagType } from "#enums/arena-tag-type";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { ElementalType } from "#enums/elemental-type";
import type { MoveId } from "#enums/move-id";
import type { BattleStat, EffectiveStat, PermanentStat, Stat, StatStage } from "#enums/stat";
import type { StatusEffect } from "#enums/status-effect";
import type { TerrainType } from "#enums/terrain-type";
import type { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";
import type { GetMatchers, MatchersBase, RestrictMatcher } from "#test/@types/matcher-helpers";
import type { OneOther } from "#test/@types/test-helpers";
import type { GameManager } from "#test/test-utils/game-manager";
import type { PartiallyFilledArenaTag } from "#test/test-utils/matchers/to-have-arena-tag";
import type { ToHaveEffectiveStatOptions } from "#test/test-utils/matchers/to-have-effective-stat-matcher";
import type { PartiallyFilledStatus } from "#test/test-utils/matchers/to-have-status-effect-matcher";
import type { ToHaveTypesOptions } from "#test/test-utils/matchers/to-have-types";
import type { MatcherTurnMove, ToHaveUsedMoveOptions } from "#test/test-utils/matchers/to-have-used-move-matcher";
import type { TurnMove } from "#types/move-types";
import type { PhaseKey } from "#types/phase-types";
import type { Status } from "#types/pokemon-types";
import type { NonEmptyArray } from "#types/utility-types";
import type { If, Integer, IsNumericLiteral, IsStringLiteral, NonNegativeInteger } from "type-fest";
import type { expect } from "vitest";

// #region Utility Types

/**
 * Type helper to restrict a type to only non-numeric literals, of any form.
 * @internal
 */
type NonNumericLiteral<T extends number> = If<IsNumericLiteral<T>, never, T>;

// #endregion Utility Types

// #region Vitest Augments

/**
 * Interface containing all additional Vitest test matchers.
 * @internal
 */
interface ExtraAssertions<T, Negative extends boolean>
  extends GenericMatchers<T>,
    RestrictMatcher<GetMatchers<GameManagerMatchers, Negative>, GameManager, T>,
    RestrictMatcher<GetMatchers<ArenaMatchers, Negative>, GameManager, T>,
    RestrictMatcher<GetMatchers<PokemonMatchers, Negative>, Pokemon, T> {}

declare module "vitest" {
  interface Assertion<T, Negative extends boolean = false> extends ExtraAssertions<T, Negative> {
    /**
     * Invert a matcher's conditions, causing it to fail whenever it would normally succeed
     * (and vice versa).
     * @privateRemarks
     * Matchers with custom "invalid" conditions can (and should) ignore this in case of invalid input.
     * Certain others have different rules for negated assertions with respect to allowed parameters.
     * @example
     * ```ts
     * expect(1).not.toBe(2);
     * expect(pokemon).not.toHaveBattlerTag(BattlerTagType.SEEDED);
     * ```
     */
    not: Assertion<T, true>;
  }
}

// #endregion Vitest Augments

// #region Generic Matchers

interface GenericMatchers<T> {
  /**
   * Matcher that checks if an array contains exactly the given items, disregarding order.
   * @remarks
   * Different from {@linkcode expect.arrayContaining} as the latter only checks for subset equality
   * (as opposed to full equality).
   * @param expected - The expected contents of the array, in any order
   */
  toEqualUnsorted: T extends readonly (infer U)[] ? (expected: readonly U[]) => void : never;

  /**
   * Matcher that checks if a `Map` contains the given key.
   * @param expectedKey - The key whose inclusion is being checked
   * @privateRemarks
   * While this functionality _could_ be simulated by writing
   * `expect(m.get(key)).toBe(y)` or
   * `expect(m.get(key)).toBe(expect.anything())`,
   * this is still preferred due to being more ergonomic and provides better error messsages.
   */
  toHaveKey: T extends ReadonlyMap<infer K, unknown> ? (expectedKey: K) => void : never;
}

// #endregion Generic Matchers

// #region GameManager Matchers

interface GameManagerMatchers {
  /**
   * Check whether the {@linkcode GameManager} has shown the given message at least once in the current test case.
   * @param expectedMessage - The message that should have been displayed
   * @remarks
   * Strings consumed by this function should _always_ be produced by a call to `i18next.t`
   * to avoid hardcoding locales text into test files.
   * @example
   * ```ts
   * expect(game).toHaveShownMessage(i18next.t("moveTriggers:splash"));
   * ```
   */
  toHaveShownMessage<T extends string>(expectedMessage: IsStringLiteral<T> extends true ? never : T): void;

  /**
   * Check whether the currently-running {@linkcode Phase} is of the given type.
   * @param expectedPhase - The {@linkcode PhaseKey | name} of the `Phase` that should be running
   */
  toBeAtPhase(expectedPhase: PhaseKey): void;
}

// #endregion GameManager Matchers

// #region Arena Matchers

declare class ArenaMatchers implements MatchersBase<keyof ArenaMatchersCommon> {
  common: ArenaMatchersCommon;
}

interface ArenaMatchersCommon {
  /**
   * Check whether the currently active weather is of the specified type.
   * @param expectedWeatherType - The {@linkcode WeatherType} that should be active
   */
  toHaveWeather(expectedWeatherType: WeatherType): void;

  /**
   * Check whether the currently active terrain is of the specified type.
   * @param expectedTerrainType - The expected {@linkcode TerrainType}, or {@linkcode TerrainType.NONE} if no terrain should be active
   */
  toHaveTerrain(expectedTerrainType: TerrainType): void;

  /**
   * Check whether the {@linkcode Arena} contains the given {@linkcode ArenaTag}.
   * @param expectedTag - A partially filled `ArenaTag` containing the desired properties to check
   */
  toHaveArenaTag<A extends ArenaTagType>(expectedTag: PartiallyFilledArenaTag<A>): void;
  /**
   * Check whether the {@linkcode Arena} contains the given {@linkcode ArenaTag}.
   * @param expectedType - The {@linkcode ArenaTagType} of the desired tag
   * @param side - (Default `ArenaTagSide.BOTH`) The {@linkcode ArenaTagSide | side(s) of the field} the tag should affect
   */
  toHaveArenaTag(expectedType: ArenaTagType, side?: ArenaTagSide): void;
}

// #endregion Arena Matchers

// #region Pokemon Matchers

interface ToHaveUsedMoveOptionsWithTypeGuard<I extends number> extends ToHaveUsedMoveOptions {
  index?: If<IsNumericLiteral<I>, Integer<I>, I>;
}

interface PokemonMatchers {
  /**
   * Check whether a {@linkcode Pokemon}'s current typing includes the given types.
   * @param expectedTypes - An array of one or more {@linkcode ElementalType}s to compare against.
   * @param options - The {@linkcode ToHaveTypesOptions | options} passed to the matcher
   */
  toHaveTypes(expectedTypes: Readonly<NonEmptyArray<ElementalType>>, options?: ToHaveTypesOptions): void;

  /**
   * Check whether a {@linkcode Pokemon} has used a move matching the given criteria.
   * @see {@linkcode Pokemon.getLastXMoves}
   * @remarks
   * By default, this only checks the most recently used move of the Pokemon. \
   * If you want to check more, you must specify that in the `options`.
   *
   * @param expectedMove - The {@linkcode MoveId} the Pokemon is expected to have used,
   * or a partially filled {@linkcode TurnMove} containing the desired properties to check.
   *
   * **Note**: one of either `moveId` or `move` is required when passing in a `TurnMove` object \
   * (normally there is no `moveId` property on a `TurnMove` object, \
   * but this specially allows passing a `moveId` property which gets compared with `turnMove.move.id`)
   * @see {@linkcode MatcherTurnMove}
   *
   * @param options - The {@linkcode ToHaveUsedMoveOptions | options} passed to the matcher
   *
   * @example
   * ```
   * expect(enemy).toHaveUsedMove(MoveId.ABSORB);
   * expect(enemy).toHaveUsedMove({ moveId: MoveId.TACKLE, targets: [BattlerIndex.PLAYER] });
   * expect(enemy).toHaveUsedMove({ move: allMoves.get(MoveId.DRAGON_DANCE), ignorePP: true });
   * ```
   */
  toHaveUsedMove<I extends number>(
    expectedMove: MoveId | OneOther<MatcherTurnMove, "move" | "moveId">,
    options?: ToHaveUsedMoveOptionsWithTypeGuard<I>,
  ): void;

  /**
   * Check whether a Pokemon's stat equals is as expected
   * @remarks
   * This checks the stat **before** modifiers are applied.
   * If you want to check the stat **after** modifiers are applied, use {@linkcode toHaveEffectiveStat}.
   * @param stat - The {@linkcode PermanentStat} to check
   * @param expectedValue - The expected value of the stat; should be a positive integer
   * @param bypassSummonData - (Default `true`) Whether to ignore temporary stat changes (such as from Transform)
   */
  toHaveStat<S extends number>(
    stat: PermanentStat,
    expectedValue: If<IsNumericLiteral<S>, NonNegativeInteger<S>, S>,
    bypassSummonData?: boolean,
  ): void;

  /**
   * Check whether a {@linkcode Pokemon}'s effective stat is as expected.
   * @remarks
   * This checks the value after all stat value modifications have occured. \
   * If you want to query the raw stat value **before** modifiers are applied,
   * use {@linkcode Pokemon.getStat} + {@linkcode toHaveStat} instead.
   * @param stat - The {@linkcode EffectiveStat} to check
   * @param expectedValue - The expected value of the stat; must be a positive integer
   * @param options - The {@linkcode ToHaveEffectiveStatOptions | options} passed to the matcher
   */
  toHaveEffectiveStat<S extends number>(
    stat: EffectiveStat,
    expectedValue: If<IsNumericLiteral<S>, NonNegativeInteger<S>, S>,
    options?: ToHaveEffectiveStatOptions,
  ): void;

  /**
   * Check whether a {@linkcode Pokemon} has a specific non-volatile status effect.
   * @param expectedStatusEffect - The {@linkcode StatusEffect} the Pokemon is expected to have,
   *   or a {@linkcode PartiallyFilledStatus} object containing the desired properties.
   * @param ignoreMockAbility - (Default `false`) Whether to ignore the effects of abilities that mock status effects (i.e. Comatose). \
   *   **Note:** This param is forced to be `true` if checking against a {@linkcode Status} object instead of a `StatusEffect`.
   */
  toHaveStatusEffect(expectedStatusEffect: StatusEffect, ignoreMockAbility?: boolean): void;
  toHaveStatusEffect(expectedStatusEffect: PartiallyFilledStatus): void;

  /**
   * Check whether a {@linkcode Pokemon} has a specific stat stage.
   * @param stat - The {@linkcode BattleStat} to check
   * @param expectedStage - The expected value of the {@linkcode StatStage | stat stage}. Must be within the range `[-6, 6]`
   */
  toHaveStatStage(stat: BattleStat, expectedStage: StatStage): void;

  /**
   * Matcher to check if a {@linkcode Pokemon} has a specific `BattlerTagType`.
   * @param expectedBattlerTagType - The expected {@linkcode BattlerTagType}.
   */
  // TODO: update this after porting battlertag serialization
  toHaveBattlerTag(expectedBattlerTagType: BattlerTagType): void;

  /**
   * Check whether a {@linkcode Pokemon} has activated a specific ability.
   * @param expectedAbilityId - The {@linkcode AbilityId} that should have been applied
   */
  toHaveAbilityApplied(expectedAbilityId: AbilityId): void;

  /**
   * Check whether a {@linkcode Pokemon} has a specific amount of HP.
   * @param expectedHp - The amount of {@linkcode Stat.HP | HP} the Pokemon should have.
   */
  toHaveHp<H extends number>(expectedHp: NonNegativeInteger<H>): void;
  /**
   * Check whether a {@linkcode Pokemon} has a specific amount of HP.
   * @param expectedHp - The amount of {@linkcode Stat.HP | HP} the Pokemon should have
   * @param roundDown - (Default `true`) Whether to round down (using {@linkcode Math.floor})
   *   or "half up" (using {@linkcode Math.round})
   */
  toHaveHp<H extends number>(expectedHp: NonNumericLiteral<H>, roundDown?: false): void;

  /**
   * Check whether a {@linkcode Pokemon} has taken a specific amount of damage.
   * @param expectedDamageTaken - The amount of damage that should have been taken; must be a positive integer
   */
  toHaveTakenDamage<D extends number>(expectedDamageTaken: NonNegativeInteger<D>): void;
  /**
   * Check whether a {@linkcode Pokemon} has taken a specific amount of damage.
   * @param expectedDamageTaken - The amount of damage that should have been taken
   * @param roundDown - (Default `true`) Whether to round down `expectedDamageTaken` with `toDmgValue` (enforces a minimum of 1)
   */
  toHaveTakenDamage<D extends number>(expectedDamageTaken: NonNumericLiteral<D>, roundDown?: false): void;

  /**
   * Check whether a {@linkcode Pokemon} is currently fainted (as determined by {@linkcode Pokemon.isFainted}).
   * @remarks
   * When checking whether an enemy wild Pokemon is fainted, \
   * you must store a reference to it in a variable _before_ the fainting effect occurs. \
   * Otherwise, the Pokemon will be removed from the field and garbage collected.
   */
  toHaveFainted(): void;

  /** Check whether a {@linkcode Pokemon} is at full HP. */
  toHaveFullHp(): void;

  /**
   * Check whether a {@linkcode Pokemon} has consumed the given amount of PP for one of its moves.
   * @param moveId - The {@linkcode MoveId} corresponding to the {@linkcode PokemonMove} that should have consumed PP
   * @param ppUsed - The numerical amount of PP that should have been consumed,
   *   or `"all"` to check that the move is _out_ of PP.
   * @remarks
   * If the Pokemon's moveset has been set via {@linkcode activeOverrides | a moveset override} \
   * or does not contain exactly one copy of `moveId`, this will fail the test.
   */
  toHaveUsedPP<P extends number>(
    moveId: MoveId,
    ppUsed: If<IsNumericLiteral<P>, NonNegativeInteger<P>, P> | "all",
  ): void;
}

// #endregion Pokemon Matchers

// biome-ignore lint/complexity/noUselessEmptyExport: Prevents exporting internal types (cf. https://github.com/microsoft/TypeScript/issues/57764)
export {};
