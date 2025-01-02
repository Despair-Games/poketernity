import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

/**
 * Attribute to double move power if the target has not used a move this turn.
 * Used for {@linkcode https://bulbapedia.bulbagarden.net/wiki/Bolt_Beak_(move) Bolt Beak}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Fishious_Rend_(move) Fishious Rend}.
 * @extends VariablePowerAttr.
 */
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
