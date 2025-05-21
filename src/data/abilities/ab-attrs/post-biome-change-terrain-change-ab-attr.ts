import { PostBiomeChangeAbAttr } from "#abilities/post-biome-change-ab-attr";
import { globalScene } from "#app/global-scene";
import type { TerrainType } from "#enums/terrain-type";
import type { Pokemon } from "#field/pokemon";

export class PostBiomeChangeTerrainChangeAbAttr extends PostBiomeChangeAbAttr {
  private readonly terrainType: TerrainType;

  constructor(terrainType: TerrainType) {
    super();

    this.terrainType = terrainType;
  }

  public override apply(_pokemon: Pokemon, simulated: boolean): boolean {
    return simulated
      ? !globalScene.arena.hasTerrain(this.terrainType)
      : globalScene.arena.trySetTerrain(this.terrainType, true);
  }
}
