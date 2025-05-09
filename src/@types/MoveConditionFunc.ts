import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";

export type MoveConditionFunc = (user: Pokemon, target: Pokemon, move: Move) => boolean;
