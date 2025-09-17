import { BattlerTag } from "#battler-tags/battler-tag";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";

/**
 * Tag representing {@link https://bulbapedia.bulbagarden.net/wiki/Glaive_Rush_(move) | Glaive Rush's}
 * secondary effect. Causes attacks against the holder
 * to deal double damage and bypass accuracy checks until
 * the holder uses another move.
 * @extends BattlerTag
 */
export class GlaiveRushTag extends BattlerTag {
  constructor() {
    super(BattlerTagType.GLAIVE_RUSH, BattlerTagLapseType.PRE_MOVE, 1, MoveId.GLAIVE_RUSH);
  }
}
