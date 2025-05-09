import type { PokemonMove } from "#field/pokemon-move";

export type PokemonMoveSelectFilter = (pokemonMove: PokemonMove) => string | null;
