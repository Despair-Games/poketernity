import { Moves } from "#enums/moves";
import { Type } from "#enums/type";
import type { Pokemon } from "#app/field/pokemon";
import { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveTypeAttr } from "#app/data/move-attrs/variable-move-type-attr";

/**
 * Changes the type of a Pledge move based on the Pledge move combined with it.
 * @extends VariableMoveTypeAttr
 */
export class CombinedPledgeTypeAttr extends VariableMoveTypeAttr {
  override apply(user: Pokemon, _target: Pokemon, move: Move, args: any[]): boolean {
    const moveType = args[0];
    if (!(moveType instanceof NumberHolder)) {
      return false;
    }

    const combinedPledgeMove = user.turnData.combiningPledge;
    if (!combinedPledgeMove) {
      return false;
    }

    switch (move.id) {
      case Moves.FIRE_PLEDGE:
        if (combinedPledgeMove === Moves.WATER_PLEDGE) {
          moveType.value = Type.WATER;
          return true;
        }
        return false;
      case Moves.WATER_PLEDGE:
        if (combinedPledgeMove === Moves.GRASS_PLEDGE) {
          moveType.value = Type.GRASS;
          return true;
        }
        return false;
      case Moves.GRASS_PLEDGE:
        if (combinedPledgeMove === Moves.FIRE_PLEDGE) {
          moveType.value = Type.FIRE;
          return true;
        }
        return false;
      default:
        return false;
    }
  }
}
