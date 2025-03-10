import { type Ability } from "#app/data/ability";
import { type Move } from "#app/data/move";
import type PokemonSpecies from "#app/data/pokemon-species";
import { type MoveId } from "#enums/move-id";

interface MoveMap<K, V> extends Map<K, V> {
  get(key: K): V;
}

// Initialized as being empty; these will be filled during initialization
export const allSpecies: PokemonSpecies[] = [];
// @ts-expect-error - this forcibly overrides `Map`'s `get` function to not type hint a return of `undefined`
export const allMoves: MoveMap<MoveId, Move> = new Map<MoveId, Move>();
export const allAbilities: Ability[] = [];
