import { PostBattleAbAttr } from "#abilities/post-battle-ab-attr";
import { globalScene } from "#app/global-scene";
import type { PostBattleAbAttrParams } from "#types/ab-attr-param-types";

/** Gives money to the user after the battle. */
export class MoneyAbAttr extends PostBattleAbAttr {
  public override apply({ simulated }: PostBattleAbAttrParams): void {
    if (!simulated) {
      globalScene.currentBattle.moneyScattered += globalScene.getWaveMoneyAmount(0.2);
    }
  }

  public override canApply({ isVictory }: Parameters<this["apply"]>[0]): boolean {
    return isVictory;
  }
}
