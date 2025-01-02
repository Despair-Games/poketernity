import { TerrainType } from "#enums/terrain-type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Attribute to clear active terrain from the field.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Defog_(move) Defog},
 * {@link https://bulbapedia.bulbagarden.net/wiki/Steel_Roller_(move) Steel Roller},
 * and {@linkcode https://bulbapedia.bulbagarden.net/wiki/Ice_Spinner_(move) Ice Spinner}.
 * @extends MoveEffectAttr
 */
export class ClearTerrainAttr extends MoveEffectAttr {
  constructor() {
    super();
  }

  override apply(_user: Pokemon, _target: Pokemon, _move: Move): boolean {
    return globalScene.arena.trySetTerrain(TerrainType.NONE, true, true);
  }
}
