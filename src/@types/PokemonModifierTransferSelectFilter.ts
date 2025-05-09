import type { PokemonHeldItemModifier } from "#app/modifier/modifier";
import type { PlayerPokemon } from "#field/player-pokemon";

export type PokemonModifierTransferSelectFilter = (
  pokemon: PlayerPokemon,
  modifier: PokemonHeldItemModifier,
) => string | null;
