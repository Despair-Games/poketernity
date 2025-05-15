import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";

export type PokemonAttackCondition = (user?: Pokemon, target?: Pokemon, move?: Move) => boolean;
