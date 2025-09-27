import { PostBattleAbAttr } from "#abilities/post-battle-ab-attr";
import { globalScene } from "#app/global-scene";
import type { Pokemon } from "#field/pokemon";

/**
 * Gives money to the user after the battle.
 */
export class MoneyAbAttr extends PostBattleAbAttr {
  public override apply(_pokemon: Pokemon, simulated: boolean, _isVictory: boolean): void {
    if (!simulated) {
      globalScene.currentBattle.moneyScattered += globalScene.getWaveMoneyAmount(0.2);
    }
  }

  public override canApply(...[, , isVictory]: Parameters<this["apply"]>): boolean {
    return isVictory;
  }
}
