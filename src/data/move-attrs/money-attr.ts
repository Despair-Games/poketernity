import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import i18next from "i18next";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Attribute to scatter coins on the field, to be collected
 * by the player at the end of battle.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Pay_Day_(move) Pay Day}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Make_It_Rain_(move) Make It Rain}.
 * @extends MoveEffectAttr
 */
export class MoneyAttr extends MoveEffectAttr {
  constructor() {
    super(true, { firstHitOnly: true });
  }

  /** Scatters coins on the field to be collected by the player at the end of battle */
  override apply(_user: Pokemon, _target: Pokemon, _move: Move): boolean {
    globalScene.currentBattle.moneyScattered += globalScene.getWaveMoneyAmount(0.2);
    globalScene.queueMessage(i18next.t("moveTriggers:coinsScatteredEverywhere"));
    return true;
  }
}
