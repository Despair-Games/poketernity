import type { MoveId } from "#enums/move-id";

/**
 * Data for a single starter species
 */
export interface StarterDataEntry {
  moveset: StarterMoveset | StarterFormMoveData | null;
  eggMoves: number;
  candyCount: number;
  candyProgress: number;
  abilityAttr: number;
  passiveAttr: number;
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

// TODO apparently unused?
export interface StarterMoveData {
  [key: number]: StarterMoveset | StarterFormMoveData;
}
