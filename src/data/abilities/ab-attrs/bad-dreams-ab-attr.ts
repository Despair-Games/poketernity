import { AbAttr } from "#abilities/ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { DrowsyTag } from "#battler-tags/drowsy-tag";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerTagType } from "#enums/battler-tag-type";
import { HitResult } from "#enums/hit-result";
import { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#field/pokemon";
import { toDmgValue } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Attribute to damage all sleeping opponents by 1/8 of their max hp at the end of turn.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Bad_Dreams_(Ability) | Bad Dreams}.
 * @todo This should extend `PostTurnAbAttr` but currently does not as a workaround until proper ability timing is implemented.
 */
export class BadDreamsAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.BAD_DREAMS);
  }

  public override apply(pokemon: Pokemon, simulated: boolean): boolean {
    let isApplied = false;

    for (const opp of pokemon.getOpponents()) {
      const isAsleep = opp.hasStatusEffect(StatusEffect.SLEEP);
      const blocksNonDirectDamage = opp.hasAbilityWithAttr(AbAttrFlag.BLOCK_NON_DIRECT_DAMAGE);
      // TODO: Workaround because Drowsy sets the sleep status AFTER applying bad dreams due to "asPhase = true"
      const willFallAsleep =
        opp.getTag<DrowsyTag>(BattlerTagType.DROWSY)?.turnCount === 1 && opp.canSetStatus(StatusEffect.SLEEP, true);

      if ((isAsleep || willFallAsleep) && !blocksNonDirectDamage && !opp.switchOutStatus) {
        if (!simulated) {
          opp.damageAndUpdate(toDmgValue(opp.getMaxHp() / 8), {
            result: HitResult.OTHER,
          });
          globalScene.phaseManager.createAndUnshiftPhase(
            "MessagePhase",
            i18next.t("abilityTriggers:badDreams", { pokemonName: getPokemonNameWithAffix(opp) }),
          );
        }

        isApplied = true;
      }
    }

    return isApplied;
  }
}
