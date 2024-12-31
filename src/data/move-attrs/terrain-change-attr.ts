import type { TerrainType } from "#enums/terrain-type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";
import type { MoveConditionFunc } from "../move-conditions";

export class TerrainChangeAttr extends MoveEffectAttr {
  private terrainType: TerrainType;

  constructor(terrainType: TerrainType) {
    super();

    this.terrainType = terrainType;
  }

  /** Sets the attribute's terrain on the field */
  override apply(_user: Pokemon, _target: Pokemon, _move: Move): boolean {
    return globalScene.arena.trySetTerrain(this.terrainType, true, true);
  }

  override getCondition(): MoveConditionFunc {
    return (_user, _target, _move) =>
      !globalScene.arena.terrain || globalScene.arena.terrain.terrainType !== this.terrainType;
  }

  override getUserBenefitScore(_user: Pokemon, _target: Pokemon, _move: Move): number {
    // TODO: Expand on this
    return globalScene.arena.terrain ? 0 : 6;
  }
}
