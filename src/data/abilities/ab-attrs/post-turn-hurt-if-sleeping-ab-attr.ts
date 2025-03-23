import { PostTurnAbAttr } from "#app/data/abilities/ab-attrs/post-turn-ab-attr";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { toDmgValue } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { HitResult } from "#enums/hit-result";
import { StatusEffect } from "#enums/status-effect";
import i18next from "i18next";

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
          opp.damageAndUpdate(toDmgValue(opp.getMaxHp() / 8), {
            result: HitResult.OTHER,
          });
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
