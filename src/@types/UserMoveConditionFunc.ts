import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";

export type UserMoveConditionFunc = (user: Pokemon, move: Move) => boolean;
