import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { MoveId } from "#enums/move-id";

/**
 * Battler tag for attacks that remove a type post use.
 */
export class RemovedTypeTag extends BattlerTag {
  constructor(tagType: BattlerTagType, lapseType: BattlerTagLapseType, sourceMoveId: MoveId) {
    super(tagType, lapseType, 1, sourceMoveId);
  }
}
