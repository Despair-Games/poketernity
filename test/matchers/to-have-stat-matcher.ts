import type { Pokemon } from "#app/field/pokemon";
import { Stat, type PermanentStat } from "#enums/stat";

export interface ToHaveStatMatcherOptions {
  /**
   * Prefer actual stats (`true`) or "in-battle" stats (`false`). Default is `true`.
   * @see {@linkcode Pokemon.getStat}
   */
  bypassSummonData?: boolean;
}

/**
 * Matcher to check if a Pokemon stat is as expected
 * @param received The object to check. Should be a {@linkcode Pokemon}.
 * @param stat The {@linkcode PermanentStat} to check
 * @param expectedValue The expected value of the {@linkcode stat}
 * @param options The {@linkcode ToHaveStatMatcherOptions}
 * @returns Whether the matcher passed
 */
export function toHaveStatMatcher(
  received: unknown,
  stat: PermanentStat,
  expectedValue: number,
  { bypassSummonData = true }: ToHaveStatMatcherOptions = {},
) {
  if (typeof received !== "object" || received === null || (received as Pokemon).type !== "Pokemon") {
    return {
      pass: false,
      message: () => `Expected Pokemon object!`,
    };
  }

  const pokemon = received as Pokemon;
  const actualValue = pokemon.getStat(stat, bypassSummonData);
  const pass = actualValue === expectedValue;

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${pokemon.name} to NOT have ${Stat[stat]}=${expectedValue}, but it did.`
        : `Expected ${pokemon.name} to have ${Stat[stat]}=${expectedValue}, but got ${actualValue}.`,
  };
}
