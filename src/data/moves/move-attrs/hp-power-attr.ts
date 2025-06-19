import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariablePowerAttr } from "#moves/variable-power-attr";
import { type NumberHolder, toDmgValue } from "#utils/common-utils";

/**
 * Attribute to set move power equal to 150 * the user's HP ratio.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Move_variations#Variations_of_Eruption | Variations of Eruption}
 */
export class HpPowerAttr extends VariablePowerAttr {
  override apply(user: Pokemon, _target: Pokemon, _move: Move, power: NumberHolder): boolean {
    power.value = toDmgValue(150 * user.getHpRatio());

    return true;
  }
}
