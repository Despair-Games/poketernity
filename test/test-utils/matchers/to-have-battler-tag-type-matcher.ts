// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Pokemon } from "#app/field/pokemon";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

import { capitalizeString } from "#app/utils/string-utils";
import { BattlerTagType } from "#enums/battler-tag-type";
import { isPokemonInstance, receivedStr } from "#test/test-utils/testUtils";
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
  const battlerTagName = BattlerTagType[expectedBattlerTagType];
  const battlerTagStr = capitalizeString(battlerTagName, "_", false, true);

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${received.name} to NOT have ${battlerTagStr}, but it did!`
        : `Expected ${received.name} to have ${battlerTagStr}, but it did not.`,
  };
}
