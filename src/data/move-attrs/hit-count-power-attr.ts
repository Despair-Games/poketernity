import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

export class HitCountPowerAttr extends VariablePowerAttr {
  override apply(user: Pokemon, _target: Pokemon, _move: Move, args: any[]): boolean {
    (args[0] as NumberHolder).value += Math.min(user.battleData.hitCount, 6) * 50;

    return true;
  }
}
