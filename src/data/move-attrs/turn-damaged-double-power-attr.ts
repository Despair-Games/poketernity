import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

export class TurnDamagedDoublePowerAttr extends VariablePowerAttr {
  override apply(user: Pokemon, target: Pokemon, _move: Move, args: any[]): boolean {
    if (user.turnData.attacksReceived.find((r) => r.damage && r.sourceId === target.id)) {
      (args[0] as NumberHolder).value *= 2;
      return true;
    }

    return false;
  }
}
