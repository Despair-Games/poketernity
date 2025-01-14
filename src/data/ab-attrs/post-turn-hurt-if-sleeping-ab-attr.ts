import type { Pokemon } from "#app/field/pokemon";
import { HitResult } from "#enums/hit-result";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { toDmgValue } from "#app/utils";
import { Abilities } from "#enums/abilities";
import { StatusEffect } from "#enums/status-effect";
import i18next from "i18next";
import { BlockNonDirectDamageAbAttr } from "./block-non-direct-damage-ab-attr";
import { PostTurnAbAttr } from "./post-turn-ab-attr";

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
        (opp.status?.effect === StatusEffect.SLEEP || opp.hasAbility(Abilities.COMATOSE))
        && !opp.hasAbilityWithAttr(BlockNonDirectDamageAbAttr)
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
