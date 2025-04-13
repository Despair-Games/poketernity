import type { DamageResult } from "#app/@types/DamageResult";
import type { Pokemon } from "#app/field/pokemon";

export interface DamageFunctionOptions {
  result?: DamageResult;
  isCritical?: boolean;
  ignoreSegments?: boolean;
  preventEndure?: boolean;
  ignoreFaintPhase?: boolean;
  source?: Pokemon;
}
