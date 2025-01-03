import { TerrainType } from "#enums/terrain-type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

export class ClearTerrainAttr extends MoveEffectAttr {
  constructor() {
    super();
  }

  override apply(_user: Pokemon, _target: Pokemon, _move: Move, _args: any[]): boolean {
    return globalScene.arena.trySetTerrain(TerrainType.NONE, true, true);
  }
}
