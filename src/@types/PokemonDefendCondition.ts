import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";

// TODO: Can this be improved?

export type PokemonDefendCondition = (target: Pokemon, user: Pokemon, move: Move) => boolean;
