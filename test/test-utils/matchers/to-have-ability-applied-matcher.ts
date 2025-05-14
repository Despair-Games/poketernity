// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Pokemon } from "#field/pokemon";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

import { getPokemonNameWithAffix } from "#app/messages";
import { AbilityId } from "#enums/ability-id";
import { isPokemonInstance, receivedStr } from "#test/test-utils/test-utils";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

/**
 * Matcher to check if a {@linkcode Pokemon} had a specific {@linkcode AbilityId} applied.
 * @param received - The object to check. Should be a {@linkcode Pokemon}.
 * @param expectedAbility - The {@linkcode AbilityId} to check for.
 * @returns Whether the matcher passed
 */
export function toHaveAbilityAppliedMatcher(
  this: MatcherState,
  received: unknown,
  expectedAbilityId: AbilityId,
): SyncExpectationResult {
  if (!isPokemonInstance(received)) {
    return {
      pass: this.isNot,
      message: () => `Expected Pokemon, but got ${receivedStr(received)}!`,
    };
  }

  const pass = received.summonData.abilitiesApplied.includes(expectedAbilityId);

  const pkmName = getPokemonNameWithAffix(received);
  const expectedAbilityStr = `${AbilityId[expectedAbilityId]} (=${expectedAbilityId})`;

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${pkmName} to NOT have ${expectedAbilityStr} ability applied, but it did!`
        : `Expected ${pkmName} to have ${expectedAbilityStr} ability applied, but it did not.`,
  };
}
