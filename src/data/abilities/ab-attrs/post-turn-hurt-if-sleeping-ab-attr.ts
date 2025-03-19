import type { Pokemon } from "#app/field/pokemon";
import { HitResult } from "#enums/hit-result";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { toDmgValue } from "#app/utils";
import { StatusEffect } from "#enums/status-effect";
import i18next from "i18next";
import { PostTurnAbAttr } from "./post-turn-ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";

/**
 * Attribute to damage all sleeping opponents by 1/8 of their max hp at the end of turn.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Bad_Dreams_(Ability) | Bad Dreams}.
 * @extends PostTurnAbAttr
 */
export class PostTurnHurtIfSleepingAbAttr extends PostTurnAbAttr {
  override apply(pokemon: Pokemon, simulated: boolean): boolean {
    let hadEffect = false;
    for (const opp of pokemon.getOpponents()) {
      if (
        opp.hasStatusEffect(StatusEffect.SLEEP)
        && !opp.hasAbilityWithAttr(AbAttrFlag.BLOCK_NON_DIRECT_DAMAGE)
        && !opp.switchOutStatus
      ) {
        if (!simulated) {
          opp.damageAndUpdate(toDmgValue(opp.getMaxHp() / 8), HitResult.OTHER);
          globalScene.queueMessage(
            i18next.t("abilityTriggers:badDreams", { pokemonName: getPokemonNameWithAffix(opp) }),
          );
        }
        hadEffect = true;
      }
    }
    return hadEffect;
  }
}
