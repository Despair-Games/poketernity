import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { Pokemon } from "#app/field/pokemon";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { ElementalType } from "#enums/elemental-type";
import type { MoveId } from "#enums/move-id";

/**
 * Tag to amplify the power of the owner's attacks of a specified type.
 * @extends BattlerTag
 */
export class TypeBoostTag extends BattlerTag {
  public boostedType: ElementalType;
  public boostValue: number;
  public oneUse: boolean;

  constructor(
    tagType: BattlerTagType,
    sourceMoveId: MoveId,
    boostedType: ElementalType,
    boostValue: number,
    oneUse: boolean,
  ) {
    super(tagType, BattlerTagLapseType.TURN_END, 1, sourceMoveId);

    this.boostedType = boostedType;
    this.boostValue = boostValue;
    this.oneUse = oneUse;
  }

  /**
   * When given a battler tag or json representing one, load the data for it.
   * @param source A battler tag
   */
  override loadTag(source: BattlerTag | any): void {
    super.loadTag(source);
    this.boostedType = source.boostedType as ElementalType;
    this.boostValue = source.boostValue;
    this.oneUse = source.oneUse;
  }

  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    return lapseType !== BattlerTagLapseType.CUSTOM || super.lapse(pokemon, lapseType);
  }

  override isTypeBoostTag(): this is this {
    return true;
  }
}
