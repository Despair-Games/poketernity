import type { Pokemon } from "#app/field/pokemon";
import { type NumberHolder, toDmgValue } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

/**
 * Attribute used for moves whose base power scales with the opponent's HP
 * Used for Crush Grip, Wring Out, and Hard Press
 * maxBasePower 100 for Hard Press, 120 for others
 */

export class OpponentHighHpPowerAttr extends VariablePowerAttr {
  maxBasePower: number;

  constructor(maxBasePower: number) {
    super();
    this.maxBasePower = maxBasePower;
  }

  /**
   * Changes the base power of the move to be the target's HP ratio times the maxBasePower with a min value of 1
   * @param _user n/a
   * @param target the Pokemon being attacked
   * @param _move n/a
   * @param args holds the base power of the move at args[0]
   * @returns true
   */
  override apply(_user: Pokemon, target: Pokemon, _move: Move, args: any[]): boolean {
    (args[0] as NumberHolder).value = toDmgValue(this.maxBasePower * target.getHpRatio());

    return true;
  }
}
