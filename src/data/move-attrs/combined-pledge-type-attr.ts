import { MoveId } from "#enums/move-id";
import { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveTypeAttr } from "#app/data/move-attrs/variable-move-type-attr";

/**
 * Attribute to change the type of a {@link https://bulbapedia.bulbagarden.net/wiki/Move_variations#Pledge_moves | Pledge move}
 * when the move is combined with another unique Pledge move.
 * The final type of the move depends on the combination:
 * - Water + Fire Pledge => combined attack is {@linkcode ElementalType.WATER | Water Type}
 * - Grass + Water Pledge => combined attack is {@linkcode ElementalType.GRASS | Grass Type}
 * - Fire + Grass Pledge => combined attack is {@linkcode ElementalType.FIRE | Fire Type}
 * @extends VariableMoveTypeAttr
 */
export class CombinedPledgeTypeAttr extends VariableMoveTypeAttr {
  override apply(user: Pokemon, _target: Pokemon, move: Move, moveType: NumberHolder): boolean {
    const combinedPledgeMove = user.turnData.combiningPledge;
    if (!combinedPledgeMove) {
      return false;
    }

    switch (move.id) {
      case MoveId.FIRE_PLEDGE:
        if (combinedPledgeMove === MoveId.WATER_PLEDGE) {
          moveType.value = ElementalType.WATER;
          return true;
        }
        return false;
      case MoveId.WATER_PLEDGE:
        if (combinedPledgeMove === MoveId.GRASS_PLEDGE) {
          moveType.value = ElementalType.GRASS;
          return true;
        }
        return false;
      case MoveId.GRASS_PLEDGE:
        if (combinedPledgeMove === MoveId.FIRE_PLEDGE) {
          moveType.value = ElementalType.FIRE;
          return true;
        }
        return false;
      default:
        return false;
    }
  }
}
