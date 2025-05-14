import { getPokemonNameWithAffix } from "#app/messages";
import { AbilityApplyMode } from "#enums/ability-apply-mode";
import { Stat, type EffectiveStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { isPokemonInstance, receivedStr } from "#test/test-utils/testUtils";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

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
  this: MatcherState,
  received: unknown,
  stat: EffectiveStat,
  expectedValue: number,
  { enemy, move, isCritical = false }: ToHaveEffectiveStatMatcherOptions = {},
): SyncExpectationResult {
  if (!isPokemonInstance(received)) {
    return {
      pass: this.isNot,
      message: () => `Expected Pokemon, but got ${receivedStr(received)}!`,
    };
  }

  const actualValue = received.getEffectiveStat(stat, enemy, move, AbilityApplyMode.DEFAULT, isCritical);
  const pass = actualValue === expectedValue;

  const pkmName = getPokemonNameWithAffix(received);
  const statName = Stat[stat];

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${pkmName} to NOT have EFFECTIVE ${statName}=${expectedValue}, but it did.`
        : `Expected ${pkmName} to have EFFECTIVE ${statName}=${expectedValue}, but got ${actualValue}.`,
  };
}
