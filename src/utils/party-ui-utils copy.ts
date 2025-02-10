import type { PlayerPokemon } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import { t } from "i18next";

export const PartyFilterAll = (_pokemon: PlayerPokemon) => null;

export const PartyFilterNonFainted = (pokemon: PlayerPokemon) => {
  if (pokemon.isFainted()) {
    return t("partyUiHandler:noEnergy", { pokemonName: getPokemonNameWithAffix(pokemon) });
  }
  return null;
};

export const PartyFilterFainted = (pokemon: PlayerPokemon) => {
  if (!pokemon.isFainted()) {
    return t("partyUiHandler:hasEnergy", { pokemonName: getPokemonNameWithAffix(pokemon) });
  }
  return null;
};
