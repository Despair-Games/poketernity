import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BATTLE_STATS } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import i18next from "i18next";

/**
 * Resets an ally's temporary stat boots to zero with no regard to
 * whether this is a positive or negative change
 *
 * Used by Curious Medicine
 * @param pokemon The {@link Pokemon} with this {@link AbAttr}
 */
export class PostSummonClearAllyStatStagesAbAttr extends PostSummonAbAttr {
  public override apply(pokemon: Pokemon, simulated: boolean): boolean {
    const target = pokemon.getAlly();
    if (target?.isActive(true)) {
      if (!simulated) {
        for (const s of BATTLE_STATS) {
          target.setStatStage(s, 0);
        }

        globalScene.phaseManager.createAndUnshiftPhase(
          "MessagePhase",
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
