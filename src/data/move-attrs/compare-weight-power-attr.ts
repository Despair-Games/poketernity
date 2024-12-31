import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

export class CompareWeightPowerAttr extends VariablePowerAttr {
  /** Modifies the given move's power based on the user's weight relative to the target */
  override apply(user: Pokemon, target: Pokemon, _move: Move, power: NumberHolder): boolean {
    const userWeight = user.getWeight();
    const targetWeight = target.getWeight();

    if (!userWeight || userWeight === 0) {
      return false;
    }

    const relativeWeight = (targetWeight / userWeight) * 100;

    switch (true) {
      case relativeWeight < 20.01:
        power.value = 120;
        break;
      case relativeWeight < 25.01:
        power.value = 100;
        break;
      case relativeWeight < 33.35:
        power.value = 80;
        break;
      case relativeWeight < 50.01:
        power.value = 60;
        break;
      default:
        power.value = 40;
        break;
    }

    return true;
  }
}
