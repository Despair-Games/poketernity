import { globalScene } from "#app/global-scene";
import { TerrainType } from "#enums/terrain-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";

/**
 * Attribute to clear active terrain from the field.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Defog_(move) | Defog},
 * {@link https://bulbapedia.bulbagarden.net/wiki/Steel_Roller_(move) | Steel Roller},
 * and {@linkcode https://bulbapedia.bulbagarden.net/wiki/Ice_Spinner_(move) | Ice Spinner}.
 * @extends MoveEffectAttr
 */
export class ClearTerrainAttr extends MoveEffectAttr {
  override applyEffect(_user: Pokemon, _target: Pokemon, _move: Move): boolean {
    return globalScene.arena.trySetTerrain(TerrainType.NONE, true, true);
  }
}
