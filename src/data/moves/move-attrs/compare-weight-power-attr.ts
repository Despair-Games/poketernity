import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariablePowerAttr } from "#moves/variable-power-attr";
import { clamp, type NumberHolder } from "#utils/common-utils";

/**
 * Attribute to modify move power based on the user's weight relative to the target.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Heavy_Slam_(move) | Heavy Slam}
 * and {@linkcode https://bulbapedia.bulbagarden.net/wiki/Heat_Crash_(move) | Heat Crash}.
 *
 * | User vs Target Weight Ratio | \| Power |
 * | :-------------------------: | :------: |
 * |    >= 5x                    |    120   |
 * |    >= 4x < 5x               |    100   |
 * |    >= 3x < 4x               |     80   |
 * |    >= 2x < 3x               |     60   |
 * |    < 2x                     |     40   |
 *
 * @extends VariablePowerAttr
 */
export class CompareWeightPowerAttr extends VariablePowerAttr {
  override apply(user: Pokemon, target: Pokemon, _move: Move, power: NumberHolder): boolean {
    const userWeight = user.getWeight();
    const targetWeight = target.getWeight();

    if (targetWeight === 0) {
      power.value = 120;
      return true;
    }

    power.value = (clamp(Math.floor(userWeight / targetWeight), 1, 5) + 1) * 20;

    return true;
  }
}
