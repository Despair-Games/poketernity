import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";

export type MoveMessageFunc = (user: Pokemon, target: Pokemon, move: Move) => string | undefined;
