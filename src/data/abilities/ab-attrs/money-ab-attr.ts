import { PostBattleAbAttr } from "#abilities/post-battle-ab-attr";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";

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
