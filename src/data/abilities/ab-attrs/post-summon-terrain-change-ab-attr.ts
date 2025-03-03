import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { TerrainType } from "#enums/terrain-type";
import { PostSummonAbAttr } from "./post-summon-ab-attr";

export class PostSummonTerrainChangeAbAttr extends PostSummonAbAttr {
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
