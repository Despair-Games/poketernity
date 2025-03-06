import type { DamageResult } from "#app/field/pokemon";
import type { BattlerIndex } from "#enums/battler-index";
import type { MoveId } from "#enums/move-id";

export interface AttackMoveResult {
  moveId: MoveId;
  result: DamageResult;
  damage: number;
  isCritical: boolean;
  sourceId: number;
  sourceBattlerIndex: BattlerIndex;
}
