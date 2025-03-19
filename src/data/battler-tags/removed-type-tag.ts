import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { MoveId } from "#enums/move-id";

/**
 * Tag for attacks that remove a type post use.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Burn_Up_(move) | Burn Up}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Double_Shock_(move) | Double Shock}
 * @extends BattlerTag
 */
export class RemovedTypeTag extends BattlerTag {
  constructor(tagType: BattlerTagType, lapseType: BattlerTagLapseType, sourceMoveId: MoveId) {
    super(tagType, lapseType, 1, sourceMoveId);
  }
}
