import { allAbilities } from "#app/data/ability";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import { PostKnockOutAbAttr } from "./post-knock-out-ab-attr";
import { UncopiableAbilityAbAttr } from "./uncopiable-ability-ab-attr";

export class CopyFaintedAllyAbilityAbAttr extends PostKnockOutAbAttr {
  override apply(pokemon: Pokemon, simulated: boolean, knockedOutPokemon: Pokemon): boolean {
    if (
      pokemon.isPlayer() === knockedOutPokemon.isPlayer()
      && !knockedOutPokemon.getAbility().hasAttr(UncopiableAbilityAbAttr)
    ) {
      if (!simulated) {
        const knockedOutAllyAb = knockedOutPokemon.getAbility().id;
        pokemon.summonData.ability = knockedOutAllyAb;
        pokemon.battleData.abilitiesRevealed.push(knockedOutAllyAb);
        globalScene.queueMessage(
          i18next.t("abilityTriggers:copyFaintedAllyAbility", {
            pokemonNameWithAffix: getPokemonNameWithAffix(knockedOutPokemon),
            abilityName: allAbilities[knockedOutPokemon.getAbility().id].name,
          }),
        );
      }
      return true;
    }

    return false;
  }
}
