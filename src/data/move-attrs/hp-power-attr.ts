import type { Pokemon } from "#app/field/pokemon";
import { type NumberHolder, toDmgValue } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

export class HpPowerAttr extends VariablePowerAttr {
  /** Sets the given move's power proportional to the user's current HP ratio */
  override apply(user: Pokemon, _target: Pokemon, _move: Move, power: NumberHolder): boolean {
    power.value = toDmgValue(150 * user.getHpRatio());

    return true;
  }
}
