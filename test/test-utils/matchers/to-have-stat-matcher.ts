import { getPokemonNameWithAffix } from "#app/messages";
import type { PermanentStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import { toHaveEffectiveStat } from "#test/test-utils/matchers/to-have-effective-stat-matcher";
import { getStatName } from "#test/test-utils/string-utils";
import { isPokemonInstance, receivedStr } from "#test/test-utils/test-utils";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

/**
 * Check whether a Pokemon's stat equals is as expected
 * @remarks
 * This checks the stat **before** modifiers are applied.
 * If you want to check the stat **after** modifiers are applied, use {@linkcode toHaveEffectiveStat}.
 * @param received - The object to check. Should be a {@linkcode Pokemon}.
 * @param stat - The {@linkcode PermanentStat} to check
 * @param expected - The expected value of the stat; should be a positive integer
 * @param bypassSummonData - (Default `true`) Whether to ignore temporary stat changes (such as from Transform)
 * @returns Whether the matcher passed
 */
export function toHaveStat(
  this: MatcherState,
  received: unknown,
  stat: PermanentStat,
  expected: number,
  bypassSummonData: boolean = true,
): SyncExpectationResult {
  if (!isPokemonInstance(received)) {
    return {
      pass: this.isNot,
      message: () => `Expected to receive a Pokémon, but got ${receivedStr(received)}!`,
    };
  }

  const actual = received.getStat(stat, bypassSummonData);
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
