import type { Pokemon } from "#field/pokemon";
import type { DamageResult } from "#types/damage-result";

export interface DamageFunctionOptions {
  result?: DamageResult;
  isCritical?: boolean;
  ignoreSegments?: boolean;
  preventEndure?: boolean;
  ignoreFaintPhase?: boolean;
  source?: Pokemon;
}
