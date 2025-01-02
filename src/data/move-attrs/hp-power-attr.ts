import type { Pokemon } from "#app/field/pokemon";
import { type NumberHolder, toDmgValue } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

/**
 * Attribute to set move power equal to 150 * the user's HP ratio.
 * @extends VariablePowerAttr
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Move_variations#Variations_of_Eruption Variations of Eruption}
 */
export class HpPowerAttr extends VariablePowerAttr {
  override apply(user: Pokemon, _target: Pokemon, _move: Move, power: NumberHolder): boolean {
    power.value = toDmgValue(150 * user.getHpRatio());

    return true;
  }
}
