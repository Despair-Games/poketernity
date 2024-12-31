import { Stat } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

/**
 * Attribute used for Electro Ball move.
 * @extends VariablePowerAttr
 * @see {@linkcode apply}
 **/

export class ElectroBallPowerAttr extends VariablePowerAttr {
  /**
   * Sets the given move's power proportional to the user's
   * {@linkcode Stat.SPD Speed} compared to the target.
   */
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
