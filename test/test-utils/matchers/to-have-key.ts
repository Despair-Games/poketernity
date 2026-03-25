import { getOnelineDiffStr } from "#test/test-utils/string-utils";
import { receivedStr } from "#test/test-utils/test-utils";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

/**
 * Matcher that checks if a `Map` contains the given key.
 * @privateRemarks
 * While this functionality _could_ be simulated by writing
 * `expect(m.get(key)).toBe(y)` or
 * `expect(m.get(key)).toBe(expect.anything())`,
 * this is still preferred due to being more ergonomic and provides better error messsages.
 * @param received - The received value. Should be a Map
 * @param expected - The key whose inclusion is being checked
 * @returns Whether the matcher passed
 */
export function toHaveKey(this: Readonly<MatcherState>, received: unknown, expected: unknown): SyncExpectationResult {
  if (!(received instanceof Map)) {
    return {
      pass: this.isNot,
      message: () => `Expected to receive a Map, but got ${receivedStr(received)}!`,
    };
  }

  if (received.size === 0) {
    return {
      pass: this.isNot,
      message: () => "Expected to receive a non-empty Map, but received map was empty!",
      expected,
      actual: received,
    };
  }

  const actual = [...received.keys()];
  const pass = this.equals(actual, expected, [
    ...this.customTesters,
    this.utils.iterableEquality,
    this.utils.subsetEquality,
  ]);

  const actualStr = getOnelineDiffStr.call(this, received);
  const expectedStr = getOnelineDiffStr.call(this, expected);

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${actualStr} to NOT have the key ${expectedStr}, but it did!`
        : `Expected ${actualStr} to have the key ${expectedStr}, but it didn't!`,
    expected,
    actual,
  };
}
