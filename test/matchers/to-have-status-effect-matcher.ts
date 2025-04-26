// -- start tsdoc imports --
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Pokemon } from "#app/field/pokemon";
// -- end tsdoc imports --

import { StatusEffect } from "#enums/status-effect";
import { isPokemonInstance, receivedStr } from "#test/test-utils/testUtils";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

//#region Types

export interface ToHaveStatusEffectMatcherOptions {
  ignoreMockAbility?: boolean;
}

//#endregion
//#region Exports

/**
 * Matcher to check if a Pokemon's {@linkcode StatusEffect} is as expected
 * @param received - The actual value received. This matcher expects this
 * value to be a {@linkcode Pokemon}
 * @param expectedStatusEffect - The {@linkcode StatusEffect} the Pokemon is
 * expected to have
 * @param ignoreMockAbility - If `true`, ignores the effects of abilities that
 * mock status effects (i.e. Comatose)
 * @returns the results of the matcher's assertion
 */
export function toHaveStatusEffectMatcher(
  this: MatcherState,
  received: unknown,
  expectedStatusEffect: StatusEffect,
  { ignoreMockAbility = false }: ToHaveStatusEffectMatcherOptions = {},
): SyncExpectationResult {
  if (!isPokemonInstance(received)) {
    return {
      pass: this.isNot,
      message: () => `Expected Pokemon, but got ${receivedStr(received)}!`,
    };
  }

  const statusEffect = received.getStatusEffect(ignoreMockAbility);
  const pass = statusEffect === expectedStatusEffect;

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${received.name} NOT to have status effect: ${StatusEffect[expectedStatusEffect]} (=${expectedStatusEffect}), but it did.`
        : `Expected ${received.name} to have status effect: ${StatusEffect[expectedStatusEffect]} (=${expectedStatusEffect}), but got: ${StatusEffect[statusEffect]} (=${statusEffect})`,
  };
}

//#endregion
