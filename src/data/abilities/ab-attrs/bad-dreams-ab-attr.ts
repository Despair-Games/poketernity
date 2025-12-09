import { AbAttr } from "#abilities/ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { DrowsyTag } from "#battler-tags/drowsy-tag";
import { BattlerTagType } from "#enums/battler-tag-type";
import { HitResult } from "#enums/hit-result";
import { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#field/pokemon";
import { toDmgValue } from "#utils/common-utils";
import { inSpeedOrder } from "#utils/speed-order-generator";
import i18next from "i18next";

/**
 * Attribute to damage all sleeping opponents by 1/8 of their max hp at the end of turn.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Bad_Dreams_(Ability) | Bad Dreams}.
 * @todo This should extend `PostTurnAbAttr` but currently does not as a workaround until proper ability timing is implemented.
 */
export class BadDreamsAbAttr extends AbAttr {
  protected override readonly abAttrKey = "BadDreamsAbAttr";

  constructor() {
    super(true);
  }

  public override apply(pokemon: Pokemon, simulated: boolean): void {
    if (simulated) {
      return;
    }

    for (const opp of inSpeedOrder(pokemon.getOpposingArenaTagSide())) {
      const isAsleep = opp.hasStatusEffect(StatusEffect.SLEEP);
      const blocksNonDirectDamage = opp.hasAbilityWithAttr("BlockNonDirectDamageAbAttr");
      // TODO: Workaround because Drowsy sets the sleep status AFTER applying bad dreams due to "asPhase = true"
      const willFallAsleep =
        opp.getTag<DrowsyTag>(BattlerTagType.DROWSY)?.turnCount === 1 && opp.canSetStatus(StatusEffect.SLEEP, true);

      if ((isAsleep || willFallAsleep) && !blocksNonDirectDamage && !opp.switchOutStatus) {
        opp.damageAndUpdate(toDmgValue(opp.getMaxHp() / 8), {
          result: HitResult.OTHER,
        });
        globalScene.phaseManager.createAndUnshiftPhase(
          "MessagePhase",
          i18next.t("abilityTriggers:badDreams", { pokemonName: getPokemonNameWithAffix(opp) }),
        );
      }
    }
  }

  public override canApply(...[pokemon, simulated]: Parameters<this["apply"]>): boolean {
    return pokemon.getOpponents().some((opp) => {
      const isAsleep = opp.hasStatusEffect(StatusEffect.SLEEP);
      const willFallAsleep =
        opp.getTag(BattlerTagType.DROWSY)?.turnCount === 1 && opp.canSetStatus(StatusEffect.SLEEP, simulated);

      return (
        (isAsleep || willFallAsleep) && !opp.hasAbilityWithAttr("BlockNonDirectDamageAbAttr") && !opp.switchOutStatus
      );
    });
  }
}
