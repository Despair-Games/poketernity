import { TerrainType } from "#enums/terrain-type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

export class ClearTerrainAttr extends MoveEffectAttr {
  constructor() {
    super();
  }

  /** Clears all terrain from the field */
  override apply(_user: Pokemon, _target: Pokemon, _move: Move): boolean {
    return globalScene.arena.trySetTerrain(TerrainType.NONE, true, true);
  }
}
