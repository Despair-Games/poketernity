import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

/**
 * Attribute to change a {@link https://bulbapedia.bulbagarden.net/wiki/Move_variations#Pledge_moves Pledge move}'s
 * power to 150 when combined with another unique Pledge move from an ally.
 * @extends VariablePowerAttr
 */
export class CombinedPledgePowerAttr extends VariablePowerAttr {
  /** Multiplies the given move's power by 150/80 when the move is combined with a different Pledge move */
  override apply(user: Pokemon, _target: Pokemon, move: Move, power: NumberHolder): boolean {
    const combinedPledgeMove = user.turnData.combiningPledge;

    if (combinedPledgeMove && combinedPledgeMove !== move.id) {
      power.value *= 150 / 80;
      return true;
    }
    return false;
  }
}
