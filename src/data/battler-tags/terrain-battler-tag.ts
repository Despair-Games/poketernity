import type { TerrainType } from "#enums/terrain-type";
import type { AtLeastOneArray } from "#types/utility-types";

export interface TerrainBattlerTag {
  terrainTypes: Readonly<AtLeastOneArray<TerrainType>>;
}
