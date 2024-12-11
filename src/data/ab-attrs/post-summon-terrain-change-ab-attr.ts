import type Pokemon from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { TerrainType } from "#enums/terrain-type";
import { PostSummonAbAttr } from "./post-summon-ab-attr";

export class PostSummonTerrainChangeAbAttr extends PostSummonAbAttr {
  private terrainType: TerrainType;

  constructor(terrainType: TerrainType) {
    super();

    this.terrainType = terrainType;
  }

  override applyPostSummon(_pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    if (simulated) {
      return globalScene.arena.terrain?.terrainType !== this.terrainType;
    } else {
      return globalScene.arena.trySetTerrain(this.terrainType, true);
    }
  }
}
