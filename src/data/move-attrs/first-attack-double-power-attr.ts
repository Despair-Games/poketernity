import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

export class FirstAttackDoublePowerAttr extends VariablePowerAttr {
  override apply(_user: Pokemon, target: Pokemon, _move: Move, power: NumberHolder): boolean {
    console.log(target.getLastXMoves(1), globalScene.currentBattle.turn);
    if (!target.getLastXMoves(1).find((m) => m.turn === globalScene.currentBattle.turn)) {
      power.value *= 2;
      return true;
    }

    return false;
  }
}
