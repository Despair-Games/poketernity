import type { GameManager } from "#test/test-utils/game-manager";
import { isGameManagerInstance, receivedStr } from "#test/test-utils/test-utils";
import { truncateString } from "#utils/string-utils";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

/**
 * Check whether the `GameManager` has shown the given message at least once in the current test case.
 * @remarks
 * Strings consumed by this function should _always_ be produced by a call to `i18next.t`
 * to avoid hardcoding locales text into test files.
 * @example
 * ```ts
 * expect(game).toHaveShownMessage(i18next.t("moveTriggers:splash"));
 * ```
 * @param received - The object to check. Should be the current {@linkcode GameManager}.
 * @param expected - The message that should have been displayed
 * @returns The result of the matching
 */
export function toHaveShownMessage(
  this: Readonly<MatcherState>,
  received: unknown,
  expected: string,
): SyncExpectationResult {
  if (!isGameManagerInstance(received)) {
    return {
      pass: this.isNot,
      message: () => `Expected to receive a GameManager, but got ${receivedStr(received)}!`,
    };
  }

  if (!received.textInterceptor) {
    return {
      pass: this.isNot,
      message: () => "Expected GameManager.TextInterceptor to be defined!",
    };
  }

  const actual = received.textInterceptor.logs;
  const pass = actual.includes(expected);
  return {
    pass,
    message: () =>
      pass
        ? `Expected the GameManager to NOT have shown the message ${truncateString(expected, 30)}, but it did!`
        : `Expected the GameManager to have shown the message ${truncateString(expected, 30)}, but it didn't!`,
    expected,
    actual,
  };
}
