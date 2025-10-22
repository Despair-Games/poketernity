import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { globalScene } from "#app/global-scene";
import type { TerrainType } from "#enums/terrain-type";
import type { Pokemon } from "#field/pokemon";

export class PostSummonTerrainChangeAbAttr extends PostSummonAbAttr {
  private readonly terrainType: TerrainType;

  constructor(terrainType: TerrainType) {
    super();

    this.terrainType = terrainType;
  }

  public override apply(_pokemon: Pokemon, simulated: boolean): void {
    if (!simulated) {
      globalScene.arena.trySetTerrain(this.terrainType, true);
    }
  }

  public override canApply(..._params: Parameters<this["apply"]>): boolean {
    return globalScene.arena.canSetTerrain(this.terrainType);
  }
}
