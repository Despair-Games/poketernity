import type { SyncExpectationResult } from "@vitest/expect";
import type Phaser from "phaser";

/**
 * Checks if an object is a Pokemon object
 * @param received the object to check
 */
export function isPokemonObject(received: unknown): SyncExpectationResult {
  let pass = false;
  let msg = "Expected a Pokemon object! ";

  if (received === null) {
    msg += "But got null.";
  } else if (received === undefined) {
    msg += "But got undefined.";
  } else if (typeof received !== "object") {
    msg += `But got ${typeof received}.`;
  } else if ((received as Phaser.GameObjects.GameObject).type !== "Pokemon") {
    msg += `But got ${(received as Phaser.GameObjects.GameObject).type}.`;
  } else {
    pass = true;
    msg = "Got a Pokemon object!";
  }

  return {
    pass,
    message: () => msg,
  };
}
