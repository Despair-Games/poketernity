import type { GameModes } from "#enums/game-modes";
import type PokemonData from "../system/pokemon-data";
import type PersistentModifierData from "../system/modifier-data";
import type { SessionHistoryResult } from "#enums/session-history-result";

export interface SessionHistory {
  seed: string;
  playTime: number;
  result: SessionHistoryResult;
  gameMode: GameModes;
  party: PokemonData[];
  modifiers: PersistentModifierData[];
  money: number;
  waveIndex: number;
  gameVersion: string;
  timestamp: number;
}
