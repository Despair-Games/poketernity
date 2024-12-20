import { TerrainType } from "#enums/terrain-type";
import { Type } from "#enums/type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveTypeAttr } from "#app/data/move-attrs/variable-move-type-attr";

/**
 * Changes the move's type to match the current terrain.
 * Has no effect if the user is not grounded.
 * @extends VariableMoveTypeAttr
 */
export class TerrainPulseTypeAttr extends VariableMoveTypeAttr {
  /**
   * @param user {@linkcode Pokemon} using this move
   * @param _target N/A
   * @param _move N/A
   * @param args [0] {@linkcode NumberHolder} The move's type to be modified
   * @returns true if the function succeeds
   */
  override apply(user: Pokemon, _target: Pokemon, _move: Move, args: any[]): boolean {
    const moveType = args[0];
    if (!(moveType instanceof NumberHolder)) {
      return false;
    }

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
