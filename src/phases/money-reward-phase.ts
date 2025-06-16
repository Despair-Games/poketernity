import { globalScene } from "#app/global-scene";
import { ArenaTagType } from "#enums/arena-tag-type";
import { PhaseId } from "#enums/phase-id";
import { MoneyMultiplierModifier } from "#modifier/modifier";
import { BattlePhase } from "#phases/abstract-battle-phase";
import { NumberHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Grants the player money at the end of a wave
 */
export class MoneyRewardPhase extends BattlePhase {
  override readonly id = PhaseId.MONEY_REWARD;

  private readonly moneyMultiplier: number;

  constructor(moneyMultiplier: number) {
    super();

    this.moneyMultiplier = moneyMultiplier;
  }

  public override start(): void {
    const moneyAmount = new NumberHolder(globalScene.getWaveMoneyAmount(this.moneyMultiplier));

    globalScene.applyModifiers(MoneyMultiplierModifier, true, moneyAmount);

    if (globalScene.arena.hasTag(ArenaTagType.HAPPY_HOUR)) {
      moneyAmount.value *= 2;
    }

    globalScene.addMoney(moneyAmount.value);

    const userLocale = navigator.language || "en-US";
    const formattedMoneyAmount = moneyAmount.value.toLocaleString(userLocale);
    const message = i18next.t("battle:moneyWon", { moneyAmount: formattedMoneyAmount });

    globalScene.ui.showText(message, null, () => this.end(), null, true);
  }
}
