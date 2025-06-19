import { globalScene } from "#app/global-scene";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import i18next from "i18next";

/**
 * Attribute to scatter coins on the field, to be collected by the player at the end of battle.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Pay_Day_(move) | Pay Day}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Make_It_Rain_(move) | Make It Rain}.
 */
export class MoneyAttr extends MoveEffectAttr {
  constructor() {
    super(true, { firstHitOnly: true });
  }

  override applyEffect(_user: Pokemon, _target: Pokemon, _move: Move): boolean {
    globalScene.currentBattle.moneyScattered += globalScene.getWaveMoneyAmount(0.2);
    globalScene.phaseManager.queueMessagePhase(i18next.t("moveTriggers:coinsScatteredEverywhere"));
    return true;
  }
}
