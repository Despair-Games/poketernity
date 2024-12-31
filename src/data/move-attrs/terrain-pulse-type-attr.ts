import { TerrainType } from "#enums/terrain-type";
import { Type } from "#enums/type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveTypeAttr } from "#app/data/move-attrs/variable-move-type-attr";

/**
 * Changes the move's type to match the current terrain.
 * Has no effect if the user is not grounded.
 * @extends VariableMoveTypeAttr
 */
export class TerrainPulseTypeAttr extends VariableMoveTypeAttr {
  /** Changes the given move's type to match the current terrain. */
  override apply(user: Pokemon, _target: Pokemon, _move: Move, moveType: NumberHolder): boolean {
    if (!user.isGrounded()) {
      return false;
    }

    const currentTerrain = globalScene.arena.getTerrainType();
    switch (currentTerrain) {
      case TerrainType.MISTY:
        moveType.value = Type.FAIRY;
        break;
      case TerrainType.ELECTRIC:
        moveType.value = Type.ELECTRIC;
        break;
      case TerrainType.GRASSY:
        moveType.value = Type.GRASS;
        break;
      case TerrainType.PSYCHIC:
        moveType.value = Type.PSYCHIC;
        break;
      default:
        return false;
    }
    return true;
  }
}
