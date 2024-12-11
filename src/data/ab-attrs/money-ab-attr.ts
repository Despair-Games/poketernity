import type Pokemon from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { PostBattleAbAttr } from "./post-battle-ab-attr";

/**
 * Gives money to the user after the battle.
 *
 * @extends PostBattleAbAttr
 * @see {@linkcode applyPostBattle}
 */
export class MoneyAbAttr extends PostBattleAbAttr {
  /**
   * @param _pokemon {@linkcode Pokemon} that is the user of this ability.
   * @param _passive N/A
   * @param args - `[0]`: boolean for if the battle ended in a victory
   * @returns `true` if successful
   */
  override applyPostBattle(_pokemon: Pokemon, _passive: boolean, simulated: boolean, args: any[]): boolean {
    const isVictory: boolean = args[0];
    if (!simulated && isVictory) {
      globalScene.currentBattle.moneyScattered += globalScene.getWaveMoneyAmount(0.2);
      return true;
    }
    return false;
  }
}
