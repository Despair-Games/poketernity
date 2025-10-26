import type { TerrainType } from "#enums/terrain-type";
import type { NonEmptyArray } from "#types/utility-types";

export interface TerrainBattlerTag {
  terrainTypes: Readonly<NonEmptyArray<TerrainType>>;
}
