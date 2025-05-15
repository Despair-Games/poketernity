import type { DamageResult } from "#app/@types/damage-result";
import type { Pokemon } from "#field/pokemon";

export interface DamageFunctionOptions {
  result?: DamageResult;
  isCritical?: boolean;
  ignoreSegments?: boolean;
  preventEndure?: boolean;
  ignoreFaintPhase?: boolean;
  source?: Pokemon;
}
