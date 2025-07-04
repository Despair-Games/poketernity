import type PokemonSpecies from "#data/pokemon-species";
import type { ElementalType } from "#enums/elemental-type";
import type { MoveId } from "#enums/move-id";
import type { Nature } from "#enums/nature";

/** Data for a single starter species */
export interface StarterDataEntry {
  moveset: StarterMoveset | StarterFormMoveData | null;
  eggMoves: number;
  candyCount: number;
  candyProgress: number;
  abilityAttr: number;
  natureAttr: number;
  ivs: number[];
  valueReduction: number;
  classicWinCount: number;
}

export interface StarterData {
  [key: number]: StarterDataEntry;
}

export type StarterMoveset = [MoveId] | [MoveId, MoveId] | [MoveId, MoveId, MoveId] | [MoveId, MoveId, MoveId, MoveId];

export interface StarterFormMoveData {
  [key: number]: StarterMoveset;
}

export interface StarterConfig {
  species: PokemonSpecies;
  dexAttr: bigint;
  abilityIndex: number;
  passive: boolean;
  nature: Nature;
  moveset?: StarterMoveset;
  pokerus: boolean;
  nickname?: string;
  teraType?: ElementalType;
}
