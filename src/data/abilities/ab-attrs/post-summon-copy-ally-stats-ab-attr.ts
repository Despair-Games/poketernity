import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { BATTLE_STATS } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import i18next from "i18next";

/**
 * Attempt to copy the stat changes on an ally pokemon. Used by Costar.
 */
export class PostSummonCopyAllyStatsAbAttr extends PostSummonAbAttr {
  public override apply(pokemon: Pokemon, simulated: boolean): void {
    const ally = pokemon.getAlly();
    if (simulated || !ally?.isActive(true)) {
      return;
    }

    for (const s of BATTLE_STATS) {
      pokemon.setStatStage(s, ally.getStatStage(s));
    }
    pokemon.updateInfo();
  }

  public override canApply(...[pokemon]: Parameters<this["apply"]>): boolean {
    const ally = pokemon.getAlly();
    return !!ally?.isActive(true) && ally.getStatStages().some((s) => s !== 0);
  }

  public override getTriggerMessage(pokemon: Pokemon, _abilityName: string): string {
    return i18next.t("abilityTriggers:costar", {
      pokemonName: getPokemonNameWithAffix(pokemon),
      allyName: getPokemonNameWithAffix(pokemon.getAlly()),
    });
  }
}
