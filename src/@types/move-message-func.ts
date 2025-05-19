import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";

export type MoveMessageFunc = (user: Pokemon, target: Pokemon, move: Move) => string | undefined;
