import { getPokemonNameWithAffix } from "#app/messages";
import { AbilityId } from "#enums/ability-id";
import type { Pokemon } from "#field/pokemon";
import { getEnumStr } from "#test/test-utils/string-utils";
import { isPokemonInstance, receivedStr } from "#test/test-utils/test-utils";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

/**
 * Check whether a Pokemon has activated a specific ability.
 * @param received - The object to check. Should be a {@linkcode Pokemon}
 * @param expectedAbility - The {@linkcode AbilityId} to check for
 * @returns Whether the matcher passed
 */
export function toHaveAbilityApplied(
  this: Readonly<MatcherState>,
  received: unknown,
  expected: AbilityId,
): SyncExpectationResult {
  if (!isPokemonInstance(received)) {
    return {
      pass: this.isNot,
      message: () => `Expected to receive a Pokemon, but got ${receivedStr(received)}!`,
    };
  }

  const actual = received.waveData.abilitiesApplied;
  const pass = actual.has(expected);

  const pkmName = getPokemonNameWithAffix(received);
  const expectedAbilityStr = getEnumStr(AbilityId, expected);

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${pkmName} to NOT have applied ${expectedAbilityStr}, but it did!`
        : `Expected ${pkmName} to have applied ${expectedAbilityStr}, but it didn't!`,
    expected,
    actual,
  };
}
