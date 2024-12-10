import type Pokemon from "#app/field/pokemon";
import { HitResult } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { TerrainType } from "#enums/terrain-type";
import { PostDefendAbAttr } from "./post-defend-ab-attr";
import type Move from "../move";

export class PostDefendTerrainChangeAbAttr extends PostDefendAbAttr {
  private terrainType: TerrainType;

  constructor(terrainType: TerrainType) {
    super();

    this.terrainType = terrainType;
  }

  override applyPostDefend(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    hitResult: HitResult,
    _args: any[],
  ): boolean {
    if (hitResult < HitResult.NO_EFFECT && !move.hitsSubstitute(attacker, pokemon)) {
      if (simulated) {
        return globalScene.arena.terrain?.terrainType !== (this.terrainType || undefined);
      } else {
        return globalScene.arena.trySetTerrain(this.terrainType, true);
      }
    }

    return false;
  }
}
