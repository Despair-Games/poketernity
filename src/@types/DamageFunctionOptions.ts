import type { DamageResult, Pokemon } from "#app/field/pokemon";

export interface DamageFunctionOptions {
  result?: DamageResult;
  isCritical?: boolean;
  ignoreSegments?: boolean;
  preventEndure?: boolean;
  ignoreFaintPhase?: boolean;
  source?: Pokemon;
}
