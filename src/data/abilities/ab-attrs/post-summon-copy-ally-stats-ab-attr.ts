import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { BATTLE_STATS } from "#enums/stat";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";
import i18next from "i18next";

/**
 * Copies the stat stages and critical hit stage of the user's ally.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Costar_(Ability)}
 */
export class PostSummonCopyAllyStatsAbAttr extends PostSummonAbAttr {
  public override apply({ pokemon, simulated }: BaseAbAttrParams): void {
    const ally = pokemon.getAlly();
    if (simulated || !ally?.isActive(true)) {
      return;
    }

    for (const s of BATTLE_STATS) {
      pokemon.setStatStage(s, ally.getStatStage(s));
    }
    pokemon.updateInfo();
  }

  public override canApply({ pokemon }: Parameters<this["apply"]>[0]): boolean {
    const ally = pokemon.getAlly();
    return !!ally?.isActive(true) && ally.getStatStages().some((s) => s !== 0);
  }

  public override getTriggerMessage({ pokemon }: Parameters<this["apply"]>[0]): string {
    return i18next.t("abilityTriggers:costar", {
      pokemonName: getPokemonNameWithAffix(pokemon),
      allyName: getPokemonNameWithAffix(pokemon.getAlly()),
    });
  }
}
