import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { PlayerPokemon } from "#field/player-pokemon";
import type { PokemonHeldItemModifier } from "#modifier/modifier";
import i18next from "i18next";

export const FilterItemMaxStacks = (pokemon: PlayerPokemon, modifier: PokemonHeldItemModifier): string | null => {
  const matchingModifier = globalScene.findModifier(
    (m) => m.isPokemonHeldItemModifier() && m.pokemonId === pokemon.id && m.matchType(modifier),
  );

  if (matchingModifier && matchingModifier.stackCount === matchingModifier.getMaxStackCount()) {
    return i18next.t("partyUiHandler:tooManyItems", { pokemonName: getPokemonNameWithAffix(pokemon) });
  }
  return null;
};
