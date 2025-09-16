import { TerrainType } from "#enums/terrain-type";
import { isGameManagerInstance, receivedStr } from "#test/test-utils/test-utils";
import { capitalizeString } from "#utils/string-utils";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

/**
 * Matcher to check if the {@linkcode TerrainType} is as expected
 * @param received - The object to check. Expects an instance of {@linkcode GameManager}.
 * @param expectedTerrainType - The expected {@linkcode TerrainType}
 * @returns Whether the matcher passed
 */
export function toHaveTerrainMatcher(
  this: MatcherState,
  received: unknown,
  expectedTerrainType: TerrainType,
): SyncExpectationResult {
  if (!isGameManagerInstance(received)) {
    return {
      pass: this.isNot,
      message: () => `Expected GameManager, but got ${receivedStr(received)}!`,
    };
  }

  if (!received.scene?.arena) {
    return {
      pass: this.isNot,
      message: () => `Expected GameManager.${received.scene ? "scene" : "scene.arena"} to be defined!`,
    };
  }

  const pass = received.scene.arena.hasTerrain(expectedTerrainType);
  const terrainStr = toTerrainStr(expectedTerrainType);
  const actualTerrainStr = toTerrainStr(received.scene.arena.terrainType);

  return {
    pass,
    message: () =>
      pass
        ? `Expected Arena to NOT have ${terrainStr} Terrain, but it did.`
        : `Expected Arena to have ${terrainStr} Terrain, but got ${actualTerrainStr} Terrain.`,
  };
}

//#region Helpers

/**
 * Get a human readable string of the TerrainType
 * @param terrainType - The {@linkcode TerrainType} to transform
 * @returns A human readable string
 */
function toTerrainStr(terrainType: TerrainType) {
  return capitalizeString(TerrainType[terrainType], "_", false, true);
}

//#endregion
