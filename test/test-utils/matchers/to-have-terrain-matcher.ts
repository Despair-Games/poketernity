import { TerrainType } from "#enums/terrain-type";
import { getEnumStr } from "#test/test-utils/string-utils";
import { isGameManagerInstance, receivedStr } from "#test/test-utils/test-utils";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

/**
 * Check whether the currently active terrain is of the specified type.
 * @param received - The object to check. Should be the current {@linkcode GameManager}.
 * @param expected - The expected {@linkcode TerrainType}, or {@linkcode TerrainType.NONE} if no terrain should be active
 * @returns Whether the matcher passed
 */
export function toHaveTerrain(
  this: Readonly<MatcherState>,
  received: unknown,
  expected: TerrainType,
): SyncExpectationResult {
  if (!isGameManagerInstance(received)) {
    return {
      pass: this.isNot,
      message: () => `Expected to receive a GameManager, but got ${receivedStr(received)}!`,
    };
  }

  if (!received.scene?.arena) {
    return {
      pass: this.isNot,
      message: () => `Expected GameManager.${received.scene ? "scene.arena" : "scene"} to be defined!`,
    };
  }

  const actual = received.scene.arena.terrainType;
  const pass = actual === expected;

  const actualStr = toTerrainStr(actual);
  const expectedStr = toTerrainStr(expected);

  return {
    pass,
    message: () =>
      pass
        ? `Expected the Arena to NOT have ${expectedStr} active, but it did!`
        : `Expected the Arena to have ${expectedStr} active, but got ${actualStr} instead!`,
    expected,
    actual,
  };
}

/**
 * Get a human readable string of the current terrain.
 * @param terrainType - The {@linkcode TerrainType} to transform
 * @returns A human readable string
 */
function toTerrainStr(terrainType: TerrainType) {
  if (terrainType === TerrainType.NONE) {
    return "no terrain";
  }
  // "Electric Terrain (=2)"
  return getEnumStr(TerrainType, terrainType, { casing: "Title", suffix: " Terrain" });
}
