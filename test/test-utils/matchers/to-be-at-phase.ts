import type { Phase } from "#app/phase";
import type { GameManager } from "#test/test-utils/game-manager";
import { isGameManagerInstance, receivedStr } from "#test/test-utils/test-utils";
import type { PhaseKey } from "#types/phase-types";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

/**
 * Check whether the currently-running {@linkcode Phase} is of the given type.
 * @param received - The object to check. Should be the current {@linkcode GameManager}
 * @param expected - The {@linkcode PhaseKey | name} of the `Phase` that should be running
 * @returns The result of the matching
 */
export function toBeAtPhase(
  this: Readonly<MatcherState>,
  received: unknown,
  expected: PhaseKey,
): SyncExpectationResult {
  if (!isGameManagerInstance(received)) {
    return {
      pass: this.isNot,
      message: () => `Expected to receive a GameManager, but got ${receivedStr(received)}!`,
    };
  }

  if (!received.scene?.phaseManager) {
    return {
      pass: this.isNot,
      message: () => `Expected GameManager.${received.scene ? "scene.phaseManager" : "scene"} to be defined!`,
    };
  }

  const currPhase = received.scene.phaseManager.getCurrentPhase();
  const pass = currPhase.is(expected);

  const actual = currPhase.phaseName;

  return {
    pass,
    message: () =>
      pass
        ? `Expected the current phase to NOT be ${expected}, but it was!`
        : `Expected the current phase to be ${expected}, but got ${actual} instead!`,
    expected,
    actual,
  };
}
