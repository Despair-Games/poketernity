import { getPokemonNameWithAffix } from "#app/messages";
import { Stat, type PermanentStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import { isPokemonInstance, receivedStr } from "#test/test-utils/testUtils";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

export interface ToHaveStatMatcherOptions {
  /**
   * Prefer actual stats (`true`) or "in-battle" stats (`false`). Default is `true`.
   * @see {@linkcode Pokemon.getStat}
   */
  bypassSummonData?: boolean;
}

/**
 * Matcher to check if a Pokemon's stat equals the expected value
 * @param received - The object to check. Should be a {@linkcode Pokemon}.
 * @param stat - The {@linkcode PermanentStat} to check
 * @param expectedValue - The expected value of the {@linkcode stat}
 * @param options - The {@linkcode ToHaveStatMatcherOptions} (optional)
 * @returns Whether the matcher passed
 */
export function toHaveStatMatcher(
  this: MatcherState,
  received: unknown,
  stat: PermanentStat,
  expectedValue: number,
  { bypassSummonData = true }: ToHaveStatMatcherOptions = {},
): SyncExpectationResult {
  if (!isPokemonInstance(received)) {
    return {
      pass: this.isNot,
      message: () => `Expected Pokemon, but got ${receivedStr(received)}!`,
    };
  }

  const pokemon = received as Pokemon;
  const actualValue = pokemon.getStat(stat, bypassSummonData);
  const pass = actualValue === expectedValue;

  const pkmName = getPokemonNameWithAffix(pokemon);
  const statName = Stat[stat];

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${pkmName} to NOT have ${statName}=${expectedValue}, but it did.`
        : `Expected ${pkmName} to have ${statName}=${expectedValue}, but got ${actualValue}.`,
  };
}
