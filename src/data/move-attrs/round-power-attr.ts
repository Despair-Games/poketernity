import type { Pokemon } from "#app/field/pokemon";
import { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

/**
 * Variable Power attribute for {@link https://bulbapedia.bulbagarden.net/wiki/Round_(move) | Round}.
 * Doubles power if another Pokemon has previously selected Round this turn.
 * @extends VariablePowerAttr
 */
export class RoundPowerAttr extends VariablePowerAttr {
  override apply(user: Pokemon, _target: Pokemon, _move: Move, args: any[]): boolean {
    const power = args[0];
    if (!(power instanceof NumberHolder)) {
      return false;
    }

    if (user.turnData?.joinedRound) {
      power.value *= 2;
      return true;
    }
    return false;
  }
}
