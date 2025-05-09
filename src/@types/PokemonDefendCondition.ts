import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";

// TODO: Can this be improved?

export type PokemonDefendCondition = (target: Pokemon, user: Pokemon, move: Move) => boolean;
