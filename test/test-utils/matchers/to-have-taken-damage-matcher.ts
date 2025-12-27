import { getPokemonNameWithAffix } from "#app/messages";
import type { Pokemon } from "#field/pokemon";
import { isPokemonInstance, receivedStr } from "#test/test-utils/test-utils";
import { toDmgValue } from "#utils/common-utils";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

/**
 * Check whether a `Pokemon` has taken a specific amount of damage.
 * @param received - The object to check. Should be a {@linkcode Pokemon}.
 * @param expectedDamageTaken - The amount of damage that should have been taken
 * @param roundDown - (Default `true`) Whether to round down `expectedDamageTaken` with `toDmgValue` (enforces a minimum of 1)
 * @returns Whether the matcher passed
 */
export function toHaveTakenDamage(
  this: Readonly<MatcherState>,
  received: unknown,
  expectedDamageTaken: number,
  roundDown: boolean = true,
): SyncExpectationResult {
  if (!isPokemonInstance(received)) {
    return {
      pass: this.isNot,
      message: () => `Expected to receive a Pokémon, but got ${receivedStr(received)}!`,
    };
  }

  const expected = roundDown ? toDmgValue(expectedDamageTaken) : expectedDamageTaken;
  const actual = received.getInverseHp();
  const pass = actual === expected;
  const pkmName = getPokemonNameWithAffix(received);

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${pkmName} to NOT have taken ${expected} damage, but it did!`
        : `Expected ${pkmName} to have taken ${expected} damage, but got ${actual} instead!`,
    expected,
    actual,
  };
}
