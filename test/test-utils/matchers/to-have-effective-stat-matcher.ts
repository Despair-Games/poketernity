import { getPokemonNameWithAffix } from "#app/messages";
import type { EffectiveStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { toHaveStat } from "#test/test-utils/matchers/to-have-stat-matcher";
import { getStatName } from "#test/test-utils/string-utils";
import { isPokemonInstance, receivedStr } from "#test/test-utils/test-utils";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

/** @see {@linkcode Pokemon.getEffectiveStat} */
export interface ToHaveEffectiveStatOptions {
  /** The opposing {@linkcode Pokemon} */
  opponent?: Pokemon;
  /** The {@linkcode Move} being used */
  move?: Move;
  /**
   * Whether a critical hit occurred or not
   * @defaultValue `false`
   */
  isCritical?: boolean;
}

/**
 * Check whether a Pokemon's effective stat is as expected.
 * @remarks
 * This checks the value after all stat value modifications have occured. \
 * If you want to query the raw stat value **before** modifiers are applied,
 * use {@linkcode Pokemon.getStat} + {@linkcode toHaveStat} instead.
 * @param received - The object to check. Should be a {@linkcode Pokemon}
 * @param stat - The {@linkcode EffectiveStat} to check
 * @param expected - The expected value of the stat; should be a positive integer
 * @param __namedParameters - (Optional) See {@linkcode ToHaveEffectiveStatOptions}
 * @returns Whether the matcher passed
 */
export function toHaveEffectiveStat(
  this: Readonly<MatcherState>,
  received: unknown,
  stat: EffectiveStat,
  expected: number,
  { opponent, move, isCritical = false }: ToHaveEffectiveStatOptions = {},
): SyncExpectationResult {
  if (!isPokemonInstance(received)) {
    return {
      pass: this.isNot,
      message: () => `Expected to receive a Pokémon, but got ${receivedStr(received)}!`,
    };
  }

  const actual = received.getEffectiveStat(stat, { opponent, move, isCritical });
  const pass = actual === expected;

  const pkmName = getPokemonNameWithAffix(received);
  const statName = getStatName(stat);

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${pkmName} to NOT have ${expected} ${statName}, but it did!`
        : `Expected ${pkmName} to have ${expected} ${statName}, but got ${actual} instead!`,
    expected,
    actual,
  };
}
