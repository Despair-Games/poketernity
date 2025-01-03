import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

/**
 * Attribute to set move power proportional to the target's weight.
 * Used by {@link https://bulbapedia.bulbagarden.net/wiki/Low_Kick_(move) Low Kick}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Grass_Knot_(move) Grass Knot}.
 * @extends VariablePowerAttr
 */
export class WeightPowerAttr extends VariablePowerAttr {
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
