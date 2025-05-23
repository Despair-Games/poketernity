import type { PlayerPokemon } from "#field/player-pokemon";

export type PokemonSelectFilter = (pokemon: PlayerPokemon) => string | null;
