import type { PokeballCounts } from "#app/battle-scene";
import type { BattleType } from "#enums/battle-type";
import type { GameModes } from "#enums/game-modes";
import type { MysteryEncounterType } from "#enums/mystery-encounter-type";
import type { MysteryEncounterSaveData } from "#mystery-encounters/mystery-encounter-save-data";
import type { ArenaData } from "#system/arena-data";
import type { ChallengeData } from "#system/challenge-data";
import type { ModifierData } from "#system/modifier-data";
import type { PokemonData } from "#system/pokemon-data";
import type { TrainerData } from "#system/trainer-data";

/**
 * Save data for a run, as defined server-side
 */
export interface SessionSaveData {
  seed: string;
  playTime: number;
  gameMode: GameModes;
  party: PokemonData[];
  enemyParty: PokemonData[];
  modifiers: ModifierData[];
  enemyModifiers: ModifierData[];
  arena: ArenaData;
  pokeballCounts: PokeballCounts;
  money: number;
  score: number;
  waveIndex: number;
  battleType: BattleType;
  /** Only defined when the current wave is a trainer battle */
  trainer: TrainerData | null;
  gameVersion: string;
  timestamp: number;
  challenges: ChallengeData[];
  /** Only defined when the current wave is a ME */
  mysteryEncounterType: MysteryEncounterType | -1;
  mysteryEncounterSaveData: MysteryEncounterSaveData;
  playerTerasUsed: number;
}
