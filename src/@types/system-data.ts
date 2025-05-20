import type { PlayerGender } from "#enums/player-gender";
import type EggData from "#system/egg-data";
import type { GameStats } from "#system/game-stats";
import type { DexData } from "#types/dex-data";
import type { StarterData } from "#types/starter-data";

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
