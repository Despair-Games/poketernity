import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariablePowerAttr } from "#moves/variable-power-attr";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute to multiply move power by the output of
 * a set {@linkcode powerMultiplierFunc | function}.
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
