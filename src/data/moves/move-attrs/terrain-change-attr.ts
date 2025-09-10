import { globalScene } from "#app/global-scene";
import type { TerrainType } from "#enums/terrain-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import type { MoveConditionFunc } from "#types/move-types";

/**
 * Attribute to add terrain of a set type to the field.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Move_variations#Terrain_moves | Terrain moves}
 */
export class TerrainChangeAttr extends MoveEffectAttr {
  private readonly terrainType: TerrainType;

  constructor(terrainType: TerrainType) {
    super(true);

    this.terrainType = terrainType;
  }

  override applyEffect(_user: Pokemon, _target: Pokemon, _move: Move): boolean {
    return globalScene.arena.trySetTerrain(this.terrainType, true, true);
  }

  override getCondition(): MoveConditionFunc {
    return (_user, _target, _move) => !globalScene.arena.hasTerrain(this.terrainType);
  }

  override getUserBenefitScore(_user: Pokemon, _target: Pokemon, _move: Move): number {
    // TODO: Expand on this
    return globalScene.arena.terrain ? 0 : 6;
  }
}
