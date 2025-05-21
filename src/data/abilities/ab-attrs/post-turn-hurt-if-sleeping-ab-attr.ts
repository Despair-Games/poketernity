import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import { PostTurnAbAttr } from "#abilities/post-turn-ab-attr";
import { PostTurnResetStatusAbAttr } from "#abilities/post-turn-reset-status-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { HitResult } from "#enums/hit-result";
import { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#field/pokemon";
import { toDmgValue } from "#utils/common-utils";
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
        && !willWakeUpThisTurn(opp)
      ) {
        if (!simulated) {
          opp.damageAndUpdate(toDmgValue(opp.getMaxHp() / 8), {
            result: HitResult.OTHER,
          });
          globalScene.phaseManager.queueMessagePhase(
            i18next.t("abilityTriggers:badDreams", { pokemonName: getPokemonNameWithAffix(opp) }),
          );
        }
        hadEffect = true;
      }
    }
    return hadEffect;
  }
}

//#region Helpers

/**
 * Check if a Pokemon will wake up this turn by simulating the PostTurnAbAttrs applications.
 * @param pokemon - The Pokemon to check
 * @returns `true` if the Pokemon will wake up this turn, `false` otherwise
 */
function willWakeUpThisTurn(pokemon: Pokemon) {
  // Will wake up from Hydration ability + Rain
  const results = applyAbAttrs<PostTurnResetStatusAbAttr>(AbAttrFlag.POST_TURN, pokemon, true);

  return results.some(({ name, result }) => PostTurnResetStatusAbAttr.prototype.constructor.name === name && result);
}

//#endregion
