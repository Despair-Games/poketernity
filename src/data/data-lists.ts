import type PokemonSpecies from "#app/data/pokemon-species";
import { type Move } from "#app/data/move";
import { type MoveId } from "#enums/move-id";
import type { Ability } from "#app/data/ability";

// Initialized as being empty; these will be filled during initialization
export const allSpecies: PokemonSpecies[] = [];
export const allMoves = new Map<MoveId, Move>();
export const allAbilities: Ability[] = [];
