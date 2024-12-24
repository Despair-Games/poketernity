import { Stat } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

/**
 * Attribute used for Gyro Ball move.
 * @extends VariablePowerAttr
 * @see {@linkcode apply}
 **/
export class GyroBallPowerAttr extends VariablePowerAttr {
  /**
   * Move that deals more damage the slower {@linkcode Stat.SPD}
   * the user is compared to the target.
   * @param user Pokemon that used the move
   * @param target The target of the move
   * @param _move Move with this attribute
   * @param args N/A
   * @returns true if the function succeeds
   */
  override apply(user: Pokemon, target: Pokemon, _move: Move, args: any[]): boolean {
    const power = args[0] as NumberHolder;
    const userSpeed = user.getEffectiveStat(Stat.SPD);
    if (userSpeed < 1) {
      // Gen 6+ always have 1 base power
      power.value = 1;
      return true;
    }

    power.value = Math.floor(Math.min(150, (25 * target.getEffectiveStat(Stat.SPD)) / userSpeed + 1));
    return true;
  }
}
