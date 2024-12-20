import type { PokeballCounts } from "#app/battle-scene";
import type { GameModes } from "#app/game-mode";
import type PokemonData from "#app/system/pokemon-data";
import type PersistentModifierData from "#app/system/modifier-data";
import type ArenaData from "#app/system/arena-data";
import type { BattleType } from "#app/battle";
import type TrainerData from "#app/system/trainer-data";
import type ChallengeData from "#app/system/challenge-data";
import type { MysteryEncounterType } from "#enums/mystery-encounter-type";
import type { MysteryEncounterSaveData } from "#app/data/mystery-encounters/mystery-encounter-save-data";

/**
 * Save data for a run, as defined server-side
 */
export interface SessionSaveData {
  seed: string;
  playTime: number;
  gameMode: GameModes;
  party: PokemonData[];
  enemyParty: PokemonData[];
  modifiers: PersistentModifierData[];
  enemyModifiers: PersistentModifierData[];
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
}
