import { receivedStr, isPokemonInstance } from "#test/test-utils/testUtils";
import type { SyncExpectationResult } from "@vitest/expect";

/**
 * Matcher to check if a Pokemon is full hp.
 * @param received - The object to check. Should be a {@linkcode Pokemon}.
 * @returns Whether the matcher passed
 */
export function toHaveFullHpMatcher(received: unknown): SyncExpectationResult {
  if (!isPokemonInstance(received)) {
    return {
      pass: false,
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
