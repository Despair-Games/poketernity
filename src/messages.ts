import { globalScene } from "#app/global-scene";
import type { Pokemon } from "#field/pokemon";
import type { nil } from "#types/utility-types";
import i18next from "i18next";

/**
 * Retrieves the Pokemon's name, potentially with an affix indicating its role (wild or foe) in the current battle context, translated
 * @param pokemon {@linkcode Pokemon} name and battle context will be retrieved from this instance
 * @returns The pokemon's name (ex: "Wild Gengar", "Ectoplasma sauvage")
 */
export function getPokemonNameWithAffix(pokemon: Pokemon | nil): string {
  if (!pokemon) {
    console.warn("Pokemon missing when trying to retrieve name.");
    return "MissingNo.";
  }

  const pokemonName = pokemon.getNameToRender();

  if (pokemon.isPlayer()) {
    return pokemonName;
  }

  if (globalScene.currentBattle.isClassicFinalBoss || pokemon.hasTrainer()) {
    return i18next.t("battle:foePokemonWithAffix", { pokemonName });
  }

  return i18next.t("battle:wildPokemonWithAffix", { pokemonName });
}
