import type Pokemon from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BATTLE_STATS } from "#enums/stat";
import i18next from "i18next";
import { PostSummonAbAttr } from "./post-summon-ab-attr";

/**
 * Resets an ally's temporary stat boots to zero with no regard to
 * whether this is a positive or negative change
 * @param pokemon The {@link Pokemon} with this {@link AbAttr}
 * @param passive N/A
 * @param args N/A
 * @returns if the move was successful
 */
export class PostSummonClearAllyStatStagesAbAttr extends PostSummonAbAttr {
  constructor() {
    super();
  }

  override applyPostSummon(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    const target = pokemon.getAlly();
    if (target?.isActive(true)) {
      if (!simulated) {
        for (const s of BATTLE_STATS) {
          target.setStatStage(s, 0);
        }

        globalScene.queueMessage(
          i18next.t("abilityTriggers:postSummonClearAllyStats", {
            pokemonNameWithAffix: getPokemonNameWithAffix(target),
          }),
        );
      }

      return true;
    }

    return false;
  }
}
