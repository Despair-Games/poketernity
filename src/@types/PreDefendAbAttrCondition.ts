import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";

export type PreDefendAbAttrCondition = (pokemon: Pokemon, attacker: Pokemon, move: Move) => boolean;
