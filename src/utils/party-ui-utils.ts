import { getPokemonNameWithAffix } from "#app/messages";
import type { PlayerPokemon } from "#field/player-pokemon";
import { t } from "i18next";

export const PartyFilterAll = (_pokemon: PlayerPokemon) => null;

export const PartyFilterNonFainted = (pokemon: PlayerPokemon): string | null => {
  if (pokemon.isFainted()) {
    return t("partyUiHandler:noEnergy", { pokemonName: getPokemonNameWithAffix(pokemon) });
  }
  return null;
};

export const PartyFilterFainted = (pokemon: PlayerPokemon): string | null => {
  if (!pokemon.isFainted()) {
    return t("partyUiHandler:hasEnergy", { pokemonName: getPokemonNameWithAffix(pokemon) });
  }
  return null;
};
