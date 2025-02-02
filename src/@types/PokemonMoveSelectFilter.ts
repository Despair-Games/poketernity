import type { PokemonMove } from "#app/field/pokemon-move";

export type PokemonMoveSelectFilter = (pokemonMove: PokemonMove) => string | null;
