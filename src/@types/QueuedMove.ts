import type { BattlerIndex } from "#enums/battler-index";
import type { MoveId } from "#enums/move-id";

export interface QueuedMove {
  moveId: MoveId;
  targets: BattlerIndex[];
  ignorePP?: boolean;
}
