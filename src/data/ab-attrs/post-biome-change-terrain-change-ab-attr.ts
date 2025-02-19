import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { TerrainType } from "#enums/terrain-type";
import { PostBiomeChangeAbAttr } from "./post-biome-change-ab-attr";

export class PostBiomeChangeTerrainChangeAbAttr extends PostBiomeChangeAbAttr {
  private readonly terrainType: TerrainType;

  constructor(terrainType: TerrainType) {
    super();

    this.terrainType = terrainType;
  }

  override apply(_pokemon: Pokemon, simulated: boolean): boolean {
    return simulated
      ? !globalScene.arena.hasTerrain(this.terrainType)
      : globalScene.arena.trySetTerrain(this.terrainType, true);
  }
}
