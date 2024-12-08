import type Pokemon from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import i18next from "i18next";

/**
 * Retrieves the Pokemon's name, potentially with an affix indicating its role (wild or foe) in the current battle context, translated
 * @param pokemon {@linkcode Pokemon} name and battle context will be retrieved from this instance
 * @returns The pokemon's name (ex: "Wild Gengar", "Ectoplasma sauvage")
 */
export function getPokemonNameWithAffix(pokemon: Pokemon | undefined): string {
  if (!pokemon) {
    return "Missigno";
  }

  if (!globalScene.currentBattle.isClassicFinalBoss) {
    return !pokemon.isPlayer()
      ? pokemon.hasTrainer()
        ? i18next.t("battle:foePokemonWithAffix", {
            pokemonName: pokemon.getNameToRender(),
          })
        : i18next.t("battle:wildPokemonWithAffix", {
            pokemonName: pokemon.getNameToRender(),
          })
      : pokemon.getNameToRender();
  } else {
    return !pokemon.isPlayer()
      ? i18next.t("battle:foePokemonWithAffix", { pokemonName: pokemon.getNameToRender() })
      : pokemon.getNameToRender();
  }
}
