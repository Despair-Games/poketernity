import { getOnelineDiffStr } from "#test/test-utils/string-utils";
import { receivedStr } from "#test/test-utils/test-utils";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

/**
 * Matcher that checks if an array contains exactly the given items, disregarding order.
 * @remarks
 * Different from {@linkcode expect.arrayContaining} as the latter only checks for subset equality
 * (as opposed to full equality).
 * @param received - The received value. Should be an array of elements
 * @param expected - The expected contents of the array, in any order
 * @returns Whether the matcher passed
 */
export function toEqualUnsorted(
  this: Readonly<MatcherState>,
  received: unknown,
  expected: unknown[],
): SyncExpectationResult {
  if (!Array.isArray(received)) {
    return {
      pass: this.isNot,
      message: () => `Expected to receive an array, but got ${receivedStr(received)}!`,
    };
  }

  if (received.length !== expected.length) {
    return {
      pass: false,
      message: () => `Expected to receive an array of length ${received.length}, but got ${expected.length} instead!`,
      expected,
      actual: received,
    };
  }

  const actualSorted = received.toSorted();
  // biome-ignore lint/nursery/useArraySortCompare: the comparison function doesn't matter as long as both are sorted the same way
  const expectedSorted = expected.toSorted();
  const pass = this.equals(actualSorted, expectedSorted, [...this.customTesters, this.utils.iterableEquality]);

  const actualStr = getOnelineDiffStr.call(this, actualSorted);
  const expectedStr = getOnelineDiffStr.call(this, expectedSorted);

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${actualStr} to NOT exactly equal ${expectedStr} without order, but it did!`
        : `Expected ${actualStr} to exactly equal ${expectedStr} without order, but it didn't!`,
    expected: expectedSorted,
    actual: actualSorted,
  };
}
