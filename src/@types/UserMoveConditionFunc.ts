import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";

export type UserMoveConditionFunc = (user: Pokemon, move: Move) => boolean;
