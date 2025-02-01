import { TerrainType } from "#enums/terrain-type";
import { ElementType } from "#enums/element-type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveTypeAttr } from "#app/data/move-attrs/variable-move-type-attr";

/**
 * Changes the move's type to match the current terrain.
 * Has no effect if the user is not grounded.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Terrain_Pulse_(move) | Terrain Pulse}.
 * @extends VariableMoveTypeAttr
 */
export class TerrainPulseTypeAttr extends VariableMoveTypeAttr {
  override apply(user: Pokemon, _target: Pokemon, _move: Move, moveType: NumberHolder): boolean {
    if (!user.isGrounded()) {
      return false;
    }

    const currentTerrain = globalScene.arena.getTerrainType();
    switch (currentTerrain) {
      case TerrainType.MISTY:
        moveType.value = ElementType.FAIRY;
        break;
      case TerrainType.ELECTRIC:
        moveType.value = ElementType.ELECTRIC;
        break;
      case TerrainType.GRASSY:
        moveType.value = ElementType.GRASS;
        break;
      case TerrainType.PSYCHIC:
        moveType.value = ElementType.PSYCHIC;
        break;
      default:
        return false;
    }
    return true;
  }
}
