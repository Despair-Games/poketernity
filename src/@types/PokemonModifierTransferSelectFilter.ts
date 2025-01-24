import type { PlayerPokemon } from "#app/field/pokemon";
import type { PokemonHeldItemModifier } from "#app/modifier/modifier";

export type PokemonModifierTransferSelectFilter = (
  pokemon: PlayerPokemon,
  modifier: PokemonHeldItemModifier,
) => string | null;
