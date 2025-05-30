// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Pokemon } from "#field/pokemon";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagType } from "#enums/battler-tag-type";
import { isPokemonInstance, receivedStr } from "#test/test-utils/test-utils";
import { enumValueToKey } from "#utils/common-utils";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

/**
 * Matcher to check if a {@linkcode Pokemon} has a specific {@linkcode BattlerTagType}.
 * @param received - The object to check. Should be a {@linkcode Pokemon}.
 * @param expectedBattlerTagType - The {@linkcode BattlerTagType} to check for.
 * @returns Whether the matcher passed
 */
export function toHaveBattlerTagTypeMatcher(
  this: MatcherState,
  received: unknown,
  expectedBattlerTagType: BattlerTagType,
): SyncExpectationResult {
  if (!isPokemonInstance(received)) {
    return {
      pass: this.isNot,
      message: () => `Expected Pokemon, but got ${receivedStr(received)}!`,
    };
  }

  const pass = received.hasTag(expectedBattlerTagType);

  const pkmName = getPokemonNameWithAffix(received);
  const expectedTagStr = `${enumValueToKey(BattlerTagType, expectedBattlerTagType)} (=${expectedBattlerTagType})`;

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${pkmName} to NOT have battler-tag ${expectedTagStr}, but it did!`
        : `Expected ${pkmName} to have battler-tag ${expectedTagStr}, but it did not.`,
  };
}
