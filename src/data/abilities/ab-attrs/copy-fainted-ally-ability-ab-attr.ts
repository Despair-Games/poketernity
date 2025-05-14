import { PostKnockOutAbAttr } from "#abilities/post-knock-out-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { allAbilities } from "#data/data-lists";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import i18next from "i18next";

export class CopyFaintedAllyAbilityAbAttr extends PostKnockOutAbAttr {
  override apply(pokemon: Pokemon, simulated: boolean, knockedOutPokemon: Pokemon): boolean {
    if (
      pokemon.isPlayer() === knockedOutPokemon.isPlayer()
      && !knockedOutPokemon.getAbility().hasAttrFlag(AbAttrFlag.UNCOPIABLE_ABILITY)
    ) {
      if (!simulated) {
        const knockedOutAllyAb = knockedOutPokemon.getAbility().id;
        pokemon.summonData.ability = knockedOutAllyAb;
        pokemon.waveData.abilitiesRevealed.push(knockedOutAllyAb);
        globalScene.phaseManager.queueMessagePhase(
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
