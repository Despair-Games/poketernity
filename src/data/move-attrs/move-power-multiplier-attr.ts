import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

/**
 * Attribute to multiply move power by the output of
 * a set {@linkcode powerMultiplierFunc function}.
 * @extends VariablePowerAttr
 */
export class MovePowerMultiplierAttr extends VariablePowerAttr {
  private powerMultiplierFunc: (user: Pokemon, target: Pokemon, move: Move) => number;

  constructor(powerMultiplier: (user: Pokemon, target: Pokemon, move: Move) => number) {
    super();

    this.powerMultiplierFunc = powerMultiplier;
  }

  override apply(user: Pokemon, target: Pokemon, move: Move, power: NumberHolder): boolean {
    power.value *= this.powerMultiplierFunc(user, target, move);

    return true;
  }
}
