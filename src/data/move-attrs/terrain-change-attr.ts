import type { TerrainType } from "#enums/terrain-type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";
import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";

/**
 * Attribute to add terrain of a set type to the field.
 * @extends MoveEffectAttr
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Move_variations#Terrain_moves | Terrain moves}
 */
export class TerrainChangeAttr extends MoveEffectAttr {
  private terrainType: TerrainType;

  constructor(terrainType: TerrainType) {
    super(true);

    this.terrainType = terrainType;
  }

  override applyEffect(_user: Pokemon, _target: Pokemon, _move: Move): boolean {
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
