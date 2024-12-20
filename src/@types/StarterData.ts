import type { Moves } from "#enums/moves";

/**
 * Data for a single starter species
 */
export interface StarterDataEntry {
  moveset: StarterMoveset | StarterFormMoveData | null;
  eggMoves: number;
  candyCount: number;
  friendship: number;
  abilityAttr: number;
  passiveAttr: number;
  valueReduction: number;
  classicWinCount: number;
}

export interface StarterData {
  [key: number]: StarterDataEntry;
}

export type StarterMoveset = [Moves] | [Moves, Moves] | [Moves, Moves, Moves] | [Moves, Moves, Moves, Moves];

export interface StarterFormMoveData {
  [key: number]: StarterMoveset;
}

// TODO apparently unused?
export interface StarterMoveData {
  [key: number]: StarterMoveset | StarterFormMoveData;
}
