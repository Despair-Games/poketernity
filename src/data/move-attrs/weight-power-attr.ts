import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

export class WeightPowerAttr extends VariablePowerAttr {
  /** Sets the given move's power proportional to the target's weight */
  override apply(_user: Pokemon, target: Pokemon, _move: Move, power: NumberHolder): boolean {
    const targetWeight = target.getWeight();
    const weightThresholds = [10, 25, 50, 100, 200];

    let w = 0;
    while (targetWeight >= weightThresholds[w]) {
      if (++w === weightThresholds.length) {
        break;
      }
    }

    power.value = (w + 1) * 20;

    return true;
  }
}
