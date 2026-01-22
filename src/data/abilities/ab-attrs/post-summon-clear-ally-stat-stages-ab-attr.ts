import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BATTLE_STATS } from "#enums/stat";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";
import i18next from "i18next";

/**
 * Resets an ally's temporary stat boots to zero with no regard to whether this is a positive or negative change
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Curious_Medicine_(Ability) | Curious Medicine (Bulbapedia)}
 */
export class PostSummonClearAllyStatStagesAbAttr extends PostSummonAbAttr {
  public override apply({ pokemon, simulated }: BaseAbAttrParams): void {
    const target = pokemon.getAlly();
    if (simulated || target == null) {
      return;
    }

    for (const s of BATTLE_STATS) {
      target.setStatStage(s, 0);
    }

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("abilityTriggers:postSummonClearAllyStats", { pokemonNameWithAffix: getPokemonNameWithAffix(target) }),
    );
  }

  public override canApply({ pokemon }: Parameters<this["apply"]>[0]): boolean {
    return !!pokemon.getAlly()?.isActive(true);
  }
}
