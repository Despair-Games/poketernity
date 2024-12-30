import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

export class LowHpPowerAttr extends VariablePowerAttr {
  override apply(user: Pokemon, _target: Pokemon, _move: Move, power: NumberHolder): boolean {
    const hpRatio = user.getHpRatio();

    switch (true) {
      case hpRatio < 0.0417:
        power.value = 200;
        break;
      case hpRatio < 0.1042:
        power.value = 150;
        break;
      case hpRatio < 0.2083:
        power.value = 100;
        break;
      case hpRatio < 0.3542:
        power.value = 80;
        break;
      case hpRatio < 0.6875:
        power.value = 40;
        break;
      default:
        power.value = 20;
        break;
    }

    return true;
  }
}
