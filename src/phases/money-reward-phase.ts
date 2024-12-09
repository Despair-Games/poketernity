import { globalScene } from "#app/global-scene";
import { MoneyMultiplierModifier } from "#app/modifier/modifier";
import { NumberHolder } from "#app/utils";
import { ArenaTagType } from "#enums/arena-tag-type";
import i18next from "i18next";
import { BattlePhase } from "./battle-phase";

export class MoneyRewardPhase extends BattlePhase {
  private moneyMultiplier: number;

  constructor(moneyMultiplier: number) {
    super();

    this.moneyMultiplier = moneyMultiplier;
  }

  public override start(): void {
    const moneyAmount = new NumberHolder(globalScene.getWaveMoneyAmount(this.moneyMultiplier));

    globalScene.applyModifiers(MoneyMultiplierModifier, true, moneyAmount);

    if (globalScene.arena.getTag(ArenaTagType.HAPPY_HOUR)) {
      moneyAmount.value *= 2;
    }

    globalScene.addMoney(moneyAmount.value);

    const userLocale = navigator.language || "en-US";
    const formattedMoneyAmount = moneyAmount.value.toLocaleString(userLocale);
    const message = i18next.t("battle:moneyWon", { moneyAmount: formattedMoneyAmount });

    globalScene.ui.showText(message, null, () => this.end(), null, true);
  }
}
