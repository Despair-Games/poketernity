import { getPokemonNameWithAffix } from "#app/messages";
import { isPokemonInstance, receivedStr } from "#test/test-utils/test-utils";
import { toDmgValue } from "#utils/common-utils";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

//#region Types

export interface ToHaveTakenDamageMatcherOptions {
  /** Whether to skip the internal {@linkcode toDmgValue} call. @defaultValue false */
  skipToDmgValue?: boolean;
}

//#endregion

/**
 * Matcher to check if a Pokemon has taken a specific amount of damage.
 * Unless specified, will run the expected damage value through {@linkcode toDmgValue}
 * to round it down and make it a minimum of 1.
 * @param received - The object to check. Should be a {@linkcode Pokemon}.
 * @param expectedDamageTaken - The expected amount of damage the {@linkcode Pokemon} has taken
 * @returns Whether the matcher passed
 */
export function toHaveTakenDamageMatcher(
  this: MatcherState,
  received: unknown,
  expectedDamageTaken: number,
  { skipToDmgValue = false }: ToHaveTakenDamageMatcherOptions = {},
): SyncExpectationResult {
  if (!isPokemonInstance(received)) {
    return {
      pass: this.isNot,
      message: () => `Expected Pokemon, but got ${receivedStr(received)}!`,
    };
  }

  const expectedDmgValue = skipToDmgValue ? expectedDamageTaken : toDmgValue(expectedDamageTaken);
  const actualDmgValue = received.getInverseHp();
  const pass = actualDmgValue === expectedDmgValue;

  const pkmName = getPokemonNameWithAffix(received);

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${pkmName} to NOT have taken ${expectedDmgValue} damage, but it did!`
        : `Expected ${pkmName} to have taken ${expectedDmgValue} damage, but got ${actualDmgValue}.`,
  };
}
