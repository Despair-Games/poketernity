import type Pokemon from "#app/field/pokemon";
import { HitResult } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { toDmgValue } from "#app/utils";
import { Abilities } from "#enums/abilities";
import { StatusEffect } from "#enums/status-effect";
import i18next from "i18next";
import { BlockNonDirectDamageAbAttr } from "./block-non-direct-damage-ab-attr";
import { PostTurnAbAttr } from "./post-turn-ab-attr";

/**
 * Attribute used for abilities (Bad Dreams) that damages the opponents for being asleep
 * @extends PostTurnAbAttr
 */
export class PostTurnHurtIfSleepingAbAttr extends PostTurnAbAttr {
  /**
   * Deals damage to all sleeping opponents equal to 1/8 of their max hp (min 1)
   * @param pokemon Pokemon that has this ability
   * @param _passive N/A
   * @param simulated `true` if applying in a simulated call.
   * @param _args N/A
   * @returns `true` if any opponents are sleeping
   */
  override applyPostTurn(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
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
