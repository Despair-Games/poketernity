import type { BattlerIndex } from "#enums/battler-index";
import type { MoveId } from "#enums/move-id";
import type { DamageResult } from "#types/DamageResult";

export interface AttackMoveResult {
  moveId: MoveId;
  result: DamageResult;
  damage: number;
  isCritical: boolean;
  sourceId: number;
  sourceBattlerIndex: BattlerIndex;
}
