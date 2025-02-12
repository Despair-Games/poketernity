import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";

export type MoveConditionFunc = (user: Pokemon, target: Pokemon, move: Move) => boolean;
