import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { BooleanHolder } from "#app/utils";
import type { TerrainType } from "#enums/terrain-type";
import { PostBiomeChangeAbAttr } from "./post-biome-change-ab-attr";

export class PostBiomeChangeTerrainChangeAbAttr extends PostBiomeChangeAbAttr {
  private terrainType: TerrainType;

  constructor(terrainType: TerrainType) {
    super();

    this.terrainType = terrainType;
  }

  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    _cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    if (simulated) {
      return globalScene.arena.terrain?.terrainType !== this.terrainType;
    } else {
      return globalScene.arena.trySetTerrain(this.terrainType, true);
    }
  }
}
