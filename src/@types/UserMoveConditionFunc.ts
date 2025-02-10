import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";

export type UserMoveConditionFunc = (user: Pokemon, move: Move) => boolean;
