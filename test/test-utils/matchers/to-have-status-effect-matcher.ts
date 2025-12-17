import { getPokemonNameWithAffix } from "#app/messages";
import { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#field/pokemon";
import { isPokemonInstance, receivedStr } from "#test/test-utils/test-utils";
import { enumValueToKey } from "#utils/common-utils";
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

  const actualStatusEffect = received.getStatusEffect(ignoreMockAbility);
  const pass = actualStatusEffect === expectedStatusEffect;

  const pkmName = getPokemonNameWithAffix(received);
  const expectedStatusEffectStr = `${enumValueToKey(StatusEffect, expectedStatusEffect)} (=${expectedStatusEffect})`;
  const actualStatusEffectStr = `${enumValueToKey(StatusEffect, actualStatusEffect)} (=${actualStatusEffect})`;

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${pkmName} NOT to have status effect: ${expectedStatusEffectStr}, but it did.`
        : `Expected ${pkmName} to have status effect: ${expectedStatusEffectStr}, but got: ${actualStatusEffectStr}.`,
  };
}

//#endregion
