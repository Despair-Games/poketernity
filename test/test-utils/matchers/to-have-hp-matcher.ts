import { getPokemonNameWithAffix } from "#app/messages";
import type { Pokemon } from "#field/pokemon";
import { isPokemonInstance, receivedStr } from "#test/test-utils/test-utils";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

/**
 * Check whether a `Pokemon` has a specific amount of HP.
 * @param received - The object to check. Should be a {@linkcode Pokemon}
 * @param expectedHp - The expected amount of HP to have. Should be a positive number
 * @param roundDown - (Default `true`) Whether to round down (using {@linkcode Math.floor})
 *   or "half up" (using {@linkcode Math.round})
 * @returns Whether the matcher passed
 */
export function toHaveHp(
  this: Readonly<MatcherState>,
  received: unknown,
  expectedHp: number,
  roundDown: boolean = true,
): SyncExpectationResult {
  if (!isPokemonInstance(received)) {
    return {
      pass: this.isNot,
      message: () => `Expected to receive a Pokémon, but got ${receivedStr(received)}!`,
    };
  }

  const expected = roundDown ? Math.floor(expectedHp) : Math.round(expectedHp);
  const actual = received.hp;
  const pass = actual === expected;

  const pkmName = getPokemonNameWithAffix(received);

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${pkmName} to NOT have ${expected} HP, but it did!`
        : `Expected ${pkmName} to have ${expected} HP, but got ${actual} HP instead!`,
    expected,
    actual,
  };
}
