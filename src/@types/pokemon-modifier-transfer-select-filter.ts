import type { PlayerPokemon } from "#field/player-pokemon";
import type { PokemonHeldItemModifier } from "#modifier/modifier";

export type PokemonModifierTransferSelectFilter = (
  pokemon: PlayerPokemon,
  modifier: PokemonHeldItemModifier,
) => string | null;
