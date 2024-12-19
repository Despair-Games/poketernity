import type { DexData } from "#app/@types/DexData";
import type EggData from "#app/system/egg-data";
import type { GameStats } from "#app/system/game-stats";
import type { PlayerGender } from "#enums/player-gender";
import type { StarterData } from "#app/@types/StarterData";

/**
 * Data for an account, as defined server-side
 * Holds trainer information as well of Pokedex and unlocks data
 */
export interface SystemSaveData {
  trainerId: number;
  secretId: number;
  gender: PlayerGender;
  dexData: DexData;
  starterData: StarterData;
  gameStats: GameStats;
  unlocks: Unlocks;
  achvUnlocks: AchvUnlocks;
  voucherUnlocks: VoucherUnlocks;
  voucherCounts: VoucherCounts;
  eggs: EggData[];
  gameVersion: string;
  timestamp: number;
  eggPity: number[];
  unlockPity: number[];
}

export interface Unlocks {
  [key: number]: boolean;
}

export interface AchvUnlocks {
  [key: string]: number;
}

export interface VoucherUnlocks {
  [key: string]: number;
}

export interface VoucherCounts {
  [type: string]: number;
}
