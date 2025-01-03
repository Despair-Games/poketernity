import type { Pokemon } from "#app/field/pokemon";
import { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

/**
 * Changes a Pledge move's power to 150 when combined with another unique Pledge
 * move from an ally.
 */
export class CombinedPledgePowerAttr extends VariablePowerAttr {
  override apply(user: Pokemon, _target: Pokemon, move: Move, args: any[]): boolean {
    const power = args[0];
    if (!(power instanceof NumberHolder)) {
      return false;
    }
    const combinedPledgeMove = user.turnData.combiningPledge;

    if (combinedPledgeMove && combinedPledgeMove !== move.id) {
      power.value *= 150 / 80;
      return true;
    }
    return false;
  }
}
