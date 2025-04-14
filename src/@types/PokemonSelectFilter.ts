import type { PlayerPokemon } from "#app/field/player-pokemon";

export type PokemonSelectFilter = (pokemon: PlayerPokemon) => string | null;
