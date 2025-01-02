import { Stat } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

/**
 * Attribute implementing {@link https://bulbapedia.bulbagarden.net/wiki/Electro_Ball_(move) Electro Ball}'s
 * move power modifier.
 * Sets the move's power proportional to the user's
 * {@linkcode Stat.SPD Speed} compared to the target.
 * @extends VariablePowerAttr
 **/
export class ElectroBallPowerAttr extends VariablePowerAttr {
  override apply(user: Pokemon, target: Pokemon, _move: Move, power: NumberHolder): boolean {
    const statRatio = target.getEffectiveStat(Stat.SPD) / user.getEffectiveStat(Stat.SPD);
    const statThresholds = [0.25, 1 / 3, 0.5, 1, -1];
    const statThresholdPowers = [150, 120, 80, 60, 40];

    let w = 0;
    while (w < statThresholds.length - 1 && statRatio > statThresholds[w]) {
      if (++w === statThresholds.length) {
        break;
      }
    }

    power.value = statThresholdPowers[w];
    return true;
  }
}
