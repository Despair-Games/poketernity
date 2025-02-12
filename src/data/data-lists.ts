import type PokemonSpecies from "#app/data/pokemon-species";
import { type Move } from "#app/data/move";
import { type MoveId } from "#enums/move-id";
import { Ability } from "#app/data/ability";
import { Abilities } from "#enums/abilities";

//#region Type

export type AllMoves = {
  [moveId in MoveId]: Move;
};

// Initialized as being empty; these will be filled during initialization
export const allSpecies: PokemonSpecies[] = [];
export const allMoves: AllMoves = {} as AllMoves;
export const allAbilities = [new Ability(Abilities.NONE, 3)];
