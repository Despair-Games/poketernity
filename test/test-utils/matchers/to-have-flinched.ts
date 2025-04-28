// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Pokemon } from "#app/field/pokemon";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

import { BattlerTagType } from "#enums/battler-tag-type";
import { isPokemonInstance, receivedStr } from "#test/test-utils/testUtils";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

/**
 * Matcher to check if a {@linkcode Pokemon} has flinched.
 * @param received - The object to check. Should be a {@linkcode Pokemon}.
 * @returns Whether the matcher passed
 */
export function toHaveFlinchedMatcher(this: MatcherState, received: unknown): SyncExpectationResult {
  if (!isPokemonInstance(received)) {
    return {
      pass: this.isNot,
      message: () => `Expected Pokemon, but got ${receivedStr(received)}!`,
    };
  }

  const pass = received.hasTag(BattlerTagType.FLINCHED);

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${received.name} to NOT have flinched, but it did!`
        : `Expected ${received.name} to have flinched, but it did not.`,
  };
}
