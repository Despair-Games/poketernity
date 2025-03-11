import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { PostBattleAbAttr } from "./post-battle-ab-attr";

/**
 * Gives money to the user after the battle.
 *
 * @extends PostBattleAbAttr
 */
export class MoneyAbAttr extends PostBattleAbAttr {
  override apply(_pokemon: Pokemon, simulated: boolean, isVictory: boolean): boolean {
    if (!simulated && isVictory) {
      globalScene.currentBattle.moneyScattered += globalScene.getWaveMoneyAmount(0.2);
      return true;
    }
    return false;
  }
}
