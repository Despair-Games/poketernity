import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { globalScene } from "#app/global-scene";
import type { TerrainType } from "#enums/terrain-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";

export class PostDefendTerrainChangeAbAttr extends PostDefendAbAttr {
  private readonly terrainType: TerrainType;

  constructor(terrainType: TerrainType) {
    super();

    this.terrainType = terrainType;
  }

  public override apply(_pokemon: Pokemon, simulated: boolean, _attacker: Pokemon, _move: Move): void {
    if (!simulated) {
      globalScene.arena.trySetTerrain(this.terrainType, true);
    }
  }

  public override canApply(...[pokemon, , attacker, move]: Parameters<this["apply"]>): boolean {
    return move.isAttackMove(attacker, pokemon) && globalScene.arena.canSetTerrain(this.terrainType);
  }
}
