import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/moves/move";
import { VariablePowerAttr } from "#app/data/moves/move-attrs/variable-power-attr";

/**
 * Attribute to set move power inversely proportional to the user's HP ratio.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Flail_(move) | Flail}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Reversal_(move) | Reversal}.
 *
 * Formula from {@link https://www.smogon.com/dex/sv/moves/flail/}
 *
 * | hp ratio (out of 48) | default bp |
 * |----------------------|------------|
 * | 0-1                  | 200        |
 * | 2-4                  | 150        |
 * | 5-9                  | 100        |
 * | 10-16                | 80         |
 * | 17-32                | 40         |
 * | 33-48                | 20         |
 *
 *
 * @extends VariablePowerAttr
 */
export class LowHpPowerAttr extends VariablePowerAttr {
  override apply(user: Pokemon, _target: Pokemon, _move: Move, power: NumberHolder): boolean {
    const hpRatio = Math.floor((48 * user.hp) / user.getMaxHp());

    if (hpRatio <= 1) {
      power.value = 200;
    } else if (hpRatio <= 4) {
      power.value = 150;
    } else if (hpRatio <= 9) {
      power.value = 100;
    } else if (hpRatio <= 16) {
      power.value = 80;
    } else if (hpRatio <= 32) {
      power.value = 40;
    } else {
      power.value = 20;
    }
    return true;
  }
}
