// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { REMOVE_TYPE_BATTLER_TAG_TYPES } from "#constants/battler-tag-constants";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

import { BattlerTag } from "#battler-tags/battler-tag";
import type { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { MoveId } from "#enums/move-id";

/**
 * Tag for attacks that remove a type post use.
 *
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Burn_Up_(move) | Burn Up}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Double_Shock_(move) | Double Shock}
 *
 * @privateRemarks
 * Tags that use or subclass this should be added to {@linkcode REMOVE_TYPE_BATTLER_TAG_TYPES}
 */
export class RemovedTypeTag extends BattlerTag {
  constructor(tagType: BattlerTagType, lapseType: BattlerTagLapseType, sourceMoveId: MoveId) {
    super(tagType, lapseType, 1, sourceMoveId);
  }
}
