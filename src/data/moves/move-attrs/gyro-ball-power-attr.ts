import { Stat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariablePowerAttr } from "#moves/variable-power-attr";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute implementing {@link https://bulbapedia.bulbagarden.net/wiki/Gyro_Ball_(move) | Gyro Ball's} power modifier.
 * The move's power increases the slower the user is compared to the target.
 * @extends VariablePowerAttr
 **/
export class GyroBallPowerAttr extends VariablePowerAttr {
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
