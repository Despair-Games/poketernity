import { getPokemonNameWithAffix } from "#app/messages";
import { isPokemonInstance, receivedStr } from "#test/test-utils/test-utils";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

/**
 * Matcher to check if a Pokemon has taken a specific amount of damage
 * @param received - The object to check. Should be a {@linkcode Pokemon}.
 * @param expectedDamageTaken - The expected amount of damage the {@linkcode Pokemon} has taken
 * @returns Whether the matcher passed
 */
export function toHaveTakenDamageMatcher(
  this: MatcherState,
  received: unknown,
  expectedDamageTaken: number,
): SyncExpectationResult {
  if (!isPokemonInstance(received)) {
    return {
      pass: this.isNot,
      message: () => `Expected Pokemon, but got ${receivedStr(received)}!`,
    };
  }

  const actualDamageTaken = received.getInverseHp();
  const pass = actualDamageTaken === expectedDamageTaken;

  const pkmName = getPokemonNameWithAffix(received);

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${pkmName} to NOT have taken ${expectedDamageTaken} damage, but it did!`
        : `Expected ${pkmName} to have taken ${expectedDamageTaken} damage, but got ${actualDamageTaken}.`,
  };
}
