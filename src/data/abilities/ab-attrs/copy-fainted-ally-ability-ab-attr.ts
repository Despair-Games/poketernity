import { PostKnockOutAbAttr } from "#abilities/post-knock-out-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { allAbilities } from "#data/data-lists";
import type { Pokemon } from "#field/pokemon";
import i18next from "i18next";

export class CopyFaintedAllyAbilityAbAttr extends PostKnockOutAbAttr {
  public override apply(pokemon: Pokemon, simulated: boolean, knockedOutPokemon: Pokemon): void {
    if (!simulated) {
      const knockedOutAllyAb = knockedOutPokemon.getAbility().id;
      pokemon.summonData.ability = knockedOutAllyAb;
      pokemon.waveData.abilitiesRevealed.push(knockedOutAllyAb);
      globalScene.phaseManager.createAndUnshiftPhase(
        "MessagePhase",
        i18next.t("abilityTriggers:copyFaintedAllyAbility", {
          pokemonNameWithAffix: getPokemonNameWithAffix(knockedOutPokemon),
          abilityName: allAbilities[knockedOutPokemon.getAbility().id].name,
        }),
      );
    }
  }

  public override canApply(...[pokemon, , knockedOutPokemon]: Parameters<this["apply"]>): boolean {
    return !pokemon.isOpponent(knockedOutPokemon) && knockedOutPokemon.getAbility().copiable;
  }
}
