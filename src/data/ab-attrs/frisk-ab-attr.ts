import { setAbilityRevealed } from "#app/data/ability-utils";
import type Pokemon from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import { PostSummonAbAttr } from "./post-summon-ab-attr";

export class FriskAbAttr extends PostSummonAbAttr {
  override applyPostSummon(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    if (!simulated) {
      for (const opponent of pokemon.getOpponents()) {
        globalScene.queueMessage(
          i18next.t("abilityTriggers:frisk", {
            pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
            opponentName: opponent.name,
            opponentAbilityName: opponent.getAbility().name,
          }),
        );
        setAbilityRevealed(opponent);
      }
    }
    return true;
  }
}
