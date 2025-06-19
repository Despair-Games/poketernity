import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariablePowerAttr } from "#moves/variable-power-attr";
import { type NumberHolder, toDmgValue } from "#utils/common-utils";

/**
 * Attribute used for moves whose base power scales with the opponent's HP
 * Used for Crush Grip, Wring Out, and Hard Press
 * `maxBasePower` 100 for Hard Press, 120 for others
 */
export class OpponentHighHpPowerAttr extends VariablePowerAttr {
  maxBasePower: number;

  constructor(maxBasePower: number) {
    super();
    this.maxBasePower = maxBasePower;
  }

  override apply(_user: Pokemon, target: Pokemon, _move: Move, power: NumberHolder): boolean {
    power.value = toDmgValue(this.maxBasePower * target.getHpRatio());

    return true;
  }
}
