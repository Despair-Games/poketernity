import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

export class LessPPMorePowerAttr extends VariablePowerAttr {
  /** Sets power inversely proportional to the given move's remaining PP */
  override apply(user: Pokemon, _target: Pokemon, move: Move, power: NumberHolder): boolean {
    const ppMax = move.pp;
    const ppUsed = user.moveset.find((m) => m.moveId === move.id)?.ppUsed ?? 0;

    let ppRemains = ppMax - ppUsed;
    /** Reduce to 0 to avoid negative numbers if user has 1PP before attack and target has Ability.PRESSURE */
    if (ppRemains < 0) {
      ppRemains = 0;
    }

    switch (ppRemains) {
      case 0:
        power.value = 200;
        break;
      case 1:
        power.value = 80;
        break;
      case 2:
        power.value = 60;
        break;
      case 3:
        power.value = 50;
        break;
      default:
        power.value = 40;
        break;
    }
    return true;
  }
}
