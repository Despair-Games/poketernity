import { Stat } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

/**
 * Attribute implementing {@link https://bulbapedia.bulbagarden.net/wiki/Gyro_Ball_(move) Gyro Ball's} power modifier.
 * The move's power increases the slower the user is compared to the target.
 * @extends VariablePowerAttr
 **/
export class GyroBallPowerAttr extends VariablePowerAttr {
  /**
   * Sets the given move's power proportional to the target's
   * {@linkcode Stat.SPD Speed} compared to the user
   */
  override apply(user: Pokemon, target: Pokemon, _move: Move, power: NumberHolder): boolean {
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
