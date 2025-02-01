import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { MoveCategory } from "#enums/move-category";
import type { TerrainType } from "#enums/terrain-type";
import { PostDefendAbAttr } from "./post-defend-ab-attr";

export class PostDefendTerrainChangeAbAttr extends PostDefendAbAttr {
  private readonly terrainType: TerrainType;

  constructor(terrainType: TerrainType) {
    super();

    this.terrainType = terrainType;
  }

  override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, move: Move): boolean {
    if (attacker.getMoveCategory(pokemon, move) !== MoveCategory.STATUS) {
      if (simulated) {
        return globalScene.arena.terrain?.terrainType !== (this.terrainType || undefined);
      } else {
        return globalScene.arena.trySetTerrain(this.terrainType, true);
      }
    }

    return false;
  }
}
