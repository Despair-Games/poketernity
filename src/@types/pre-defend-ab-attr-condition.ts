import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";

export type PreDefendAbAttrCondition = (pokemon: Pokemon, attacker: Pokemon, move: Move) => boolean;
