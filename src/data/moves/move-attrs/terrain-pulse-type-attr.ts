import { TerrainType } from "#enums/terrain-type";
import { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/moves/move";
import { VariableMoveTypeAttr } from "#app/data/moves/move-attrs/variable-move-type-attr";

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
        moveType.value = ElementalType.FAIRY;
        break;
      case TerrainType.ELECTRIC:
        moveType.value = ElementalType.ELECTRIC;
        break;
      case TerrainType.GRASSY:
        moveType.value = ElementalType.GRASS;
        break;
      case TerrainType.PSYCHIC:
        moveType.value = ElementalType.PSYCHIC;
        break;
      default:
        return false;
    }
    return true;
  }
}
