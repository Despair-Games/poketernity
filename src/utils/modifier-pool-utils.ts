import type { ModifierPool } from "#app/@types/ModifierPool";
import {
  dailyStarterModifierPool,
  enemyBuffModifierPool,
  modifierPool,
  trainerModifierPool,
  wildModifierPool,
} from "#app/modifier/modifier-pools";
import { ModifierPoolType } from "#enums/modifier-pool-type";

export function getModifierPoolForType(poolType: ModifierPoolType): ModifierPool {
  let pool: ModifierPool;
  switch (poolType) {
    case ModifierPoolType.PLAYER:
      pool = modifierPool;
      break;
    case ModifierPoolType.WILD:
      pool = wildModifierPool;
      break;
    case ModifierPoolType.TRAINER:
      pool = trainerModifierPool;
      break;
    case ModifierPoolType.ENEMY_BUFF:
      pool = enemyBuffModifierPool;
      break;
    case ModifierPoolType.DAILY_STARTER:
      pool = dailyStarterModifierPool;
      break;
  }
  return pool;
}
