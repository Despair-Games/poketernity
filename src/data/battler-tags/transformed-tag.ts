import { BattlerTag } from "#battler-tags/battler-tag";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";

/**
 * BattlerTag to keep track if a Pokemon is transformed.
 * A transformed Pokemon cannot be the target of Transform/Imposter
 */
export class TransformedTag extends BattlerTag {
  constructor() {
    super(BattlerTagType.TRANSFORMED, BattlerTagLapseType.TURN_END, 1);
  }

  override lapse() {
    return true;
  }
}
