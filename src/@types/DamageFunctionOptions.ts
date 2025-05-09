import type { Pokemon } from "#app/field/pokemon";
import type { DamageResult } from "#types/DamageResult";

export interface DamageFunctionOptions {
  result?: DamageResult;
  isCritical?: boolean;
  ignoreSegments?: boolean;
  preventEndure?: boolean;
  ignoreFaintPhase?: boolean;
  source?: Pokemon;
}
