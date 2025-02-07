import type { PlayerPokemon } from "#app/field/pokemon";

export type PokemonSelectFilter = (pokemon: PlayerPokemon) => string | null;
