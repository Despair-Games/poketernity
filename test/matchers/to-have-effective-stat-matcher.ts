import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import { AbilityApplyMode } from "#enums/ability-apply-mode";
import { Stat, type EffectiveStat } from "#enums/stat";
import { receivedStr, isPokemonInstance } from "#test/test-utils/testUtils";

export interface ToHaveEffectiveStatMatcherOptions {
  /**
   * The target {@linkcode Pokemon}
   * @see {@linkcode Pokemon#getEffectiveStat}
   */
  enemy?: Pokemon;
  /**
   * The {@linkcode Move} being used
   * @see {@linkcode Pokemon#getEffectiveStat}
   */
  move?: Move;
  /**
   * Determines whether a critical hit has occurred or not (`false` by default)
   * @see {@linkcode Pokemon#getEffectiveStat}
   */
  isCritical?: boolean;
}

/**
 * Matcher to check if a {@linkcode Pokemon}'s effective stat equals the expected value
 * @param received - The object to check. Should be a {@linkcode Pokemon}.
 * @param stat - The {@linkcode EffectiveStat} to check
 * @param expectedValue - The expected value of the {@linkcode stat}
 * @param options - The {@linkcode ToHaveEffectiveStatMatcherOptions}
 * @returns Whether the matcher passed
 */
export function toHaveEffectiveStatMatcher(
  received: unknown,
  stat: EffectiveStat,
  expectedValue: number,
  { enemy, move, isCritical = false }: ToHaveEffectiveStatMatcherOptions = {},
) {
  if (!isPokemonInstance(received)) {
    return {
      pass: false,
      message: () => `Expected Pokemon, but got ${receivedStr(received)}!`,
    };
  }

  const actualValue = received.getEffectiveStat(stat, enemy, move, AbilityApplyMode.DEFAULT, isCritical);
  const pass = actualValue === expectedValue;

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${received.name} to NOT have EFFECTIVE ${Stat[stat]}=${expectedValue}, but it did.`
        : `Expected ${received.name} to have EFFECTIVE ${Stat[stat]}=${expectedValue}, but got ${actualValue}.`,
  };
}
