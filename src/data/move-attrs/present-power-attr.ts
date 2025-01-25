import type { Pokemon } from "#app/field/pokemon";
import { type NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

/**
 * Attribute to set move power based on one of four random Presents. One of which
 * heals the target for 25% of its maximum HP instead of dealing damage.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Present_(move) | Present}.
 * @extends VariablePowerAttr
 */
export class PresentPowerAttr extends VariablePowerAttr {
  override apply(_user: Pokemon, _target: Pokemon, move: Move, power: NumberHolder): boolean {
    /**
     * If this move is multi-hit, and this attribute is applied to any hit
     * other than the first, this move cannot result in a heal.
     */

    const powerSeed = move.chance;
    if (powerSeed < 40) {
      power.value = 40;
    } else if (powerSeed < 70) {
      power.value = 80;
    } else if (powerSeed < 80) {
      power.value = 120;
    }
    move.chance = 0;
    return true;
  }
}
