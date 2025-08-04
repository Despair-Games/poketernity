import type { Ability } from "#abilities/ability";
import type { Biome } from "#data/biome";
import type { PokemonSpecies } from "#data/pokemon-species";
import type { BiomeId } from "#enums/biome-id";
import type { MoveId } from "#enums/move-id";
import type { Move } from "#moves/move";

interface DataMap<K, V> extends Map<K, V> {
  get(key: K): V;
}

// Initialized as being empty; these will be filled during initialization
export const allSpecies: PokemonSpecies[] = [];
// @ts-expect-error - this forcibly overrides `Map`'s `get` function to not type hint a return of `undefined`
export const allMoves: DataMap<MoveId, Move> = new Map<MoveId, Move>();
export const allAbilities: Ability[] = [];
// @ts-expect-error - this forcibly overrides `Map`'s `get` function to not type hint a return of `undefined`
export const allBiomes: DataMap<BiomeId, Biome> = new Map<BiomeId, Biome>();
