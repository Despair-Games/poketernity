import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { globalScene } from "#app/global-scene";
import { MoveCategory } from "#enums/move-category";
import type { TerrainType } from "#enums/terrain-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";

export class PostDefendTerrainChangeAbAttr extends PostDefendAbAttr {
  private readonly terrainType: TerrainType;

  constructor(terrainType: TerrainType) {
    super();

    this.terrainType = terrainType;
  }

  public override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, move: Move): boolean {
    if (attacker.getMoveCategory(pokemon, move) !== MoveCategory.STATUS) {
      return simulated
        ? !globalScene.arena.hasTerrain(this.terrainType)
        : globalScene.arena.trySetTerrain(this.terrainType, true);
    }

    return false;
  }
}
