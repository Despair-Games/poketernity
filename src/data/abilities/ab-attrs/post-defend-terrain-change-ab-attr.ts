import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { globalScene } from "#app/global-scene";
import type { TerrainType } from "#enums/terrain-type";
import type { PostDefendAbAttrParams } from "#types/ab-attr-param-types";

export class PostDefendTerrainChangeAbAttr extends PostDefendAbAttr {
  private readonly terrainType: TerrainType;

  constructor(terrainType: TerrainType) {
    super();

    this.terrainType = terrainType;
  }

  public override apply({ simulated }: PostDefendAbAttrParams): void {
    if (!simulated) {
      globalScene.arena.trySetTerrain(this.terrainType, true);
    }
  }

  public override canApply({ pokemon, attacker, move }: Parameters<this["apply"]>[0]): boolean {
    return move.isAttackMove(attacker, pokemon) && globalScene.arena.canSetTerrain(this.terrainType);
  }
}
