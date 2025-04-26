import { isPokemonInstance, receivedStr } from "#test/test-utils/testUtils";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

/**
 * Matcher to check if a Pokemon is full hp.
 * @param received - The object to check. Should be a {@linkcode Pokemon}.
 * @returns Whether the matcher passed
 */
export function toHaveFullHpMatcher(this: MatcherState, received: unknown): SyncExpectationResult {
  if (!isPokemonInstance(received)) {
    return {
      pass: this.isNot,
      message: () => `Expected Pokemon, but got ${receivedStr(received)}!`,
    };
  }

  const pass = received.isFullHp() === true;
  const ofHpStr = `${received.getInverseHp()}/${received.getMaxHp()} HP`;

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${received.name} to NOT have full hp (${ofHpStr}), but it did!`
        : `Expected ${received.name} to have full hp, but found ${ofHpStr}.`,
  };
}
