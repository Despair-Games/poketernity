import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { ElementalType } from "#enums/elemental-type";
import type { MoveId } from "#enums/move-id";

/**
 * Tag representing a gained immunity to a specified type.
 * @extends BattlerTag
 */
export abstract class TypeImmuneTag extends BattlerTag {
  public immuneType: ElementalType;

  constructor(tagType: BattlerTagType, sourceMoveId: MoveId, immuneType: ElementalType, length: number = 1) {
    super(tagType, BattlerTagLapseType.TURN_END, length, sourceMoveId, undefined, true);

    this.immuneType = immuneType;
  }

  /**
   * When given a battler tag or json representing one, load the data for it.
   * @param source A battler tag
   */
  override loadTag(source: BattlerTag | any): void {
    super.loadTag(source);
    this.immuneType = source.immuneType as ElementalType;
  }
}
