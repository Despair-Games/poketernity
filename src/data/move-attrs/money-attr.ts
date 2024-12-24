import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import i18next from "i18next";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

export class MoneyAttr extends MoveEffectAttr {
  constructor() {
    super(true, { firstHitOnly: true });
  }

  override apply(_user: Pokemon, _target: Pokemon, _move: Move): boolean {
    globalScene.currentBattle.moneyScattered += globalScene.getWaveMoneyAmount(0.2);
    globalScene.queueMessage(i18next.t("moveTriggers:coinsScatteredEverywhere"));
    return true;
  }
}
