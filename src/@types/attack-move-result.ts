import type { FieldBattlerIndex } from "#enums/battler-index";
import type { MoveId } from "#enums/move-id";
import type { DamageResult } from "#types/damage-result";

export interface AttackMoveResult {
  moveId: MoveId;
  result: DamageResult;
  damage: number;
  isCritical: boolean;
  sourceId: number;
  sourceBattlerIndex: FieldBattlerIndex;
}
