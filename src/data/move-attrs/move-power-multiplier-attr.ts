import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

export class MovePowerMultiplierAttr extends VariablePowerAttr {
  private powerMultiplierFunc: (user: Pokemon, target: Pokemon, move: Move) => number;

  constructor(powerMultiplier: (user: Pokemon, target: Pokemon, move: Move) => number) {
    super();

    this.powerMultiplierFunc = powerMultiplier;
  }

  /** Multiplies the given move's power by a value obtained from this attribute's multiplier function */
  override apply(user: Pokemon, target: Pokemon, move: Move, power: NumberHolder): boolean {
    power.value *= this.powerMultiplierFunc(user, target, move);

    return true;
  }
}
