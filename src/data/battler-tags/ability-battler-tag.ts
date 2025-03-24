import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { AbilityId } from "#enums/ability-id";
import type { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import type { BattlerTagType } from "#enums/battler-tag-type";

/**
 * Tag representing the effect(s) of an ability.
 * @extends BattlerTag
 */
export abstract class AbilityBattlerTag extends BattlerTag {
  public ability: AbilityId;

  constructor(tagType: BattlerTagType, ability: AbilityId, lapseType: BattlerTagLapseType, turnCount: number) {
    super(tagType, lapseType, turnCount);

    this.ability = ability;
  }

  /**
   * When given a battler tag or json representing one, load the data for it.
   * @param source A battler tag
   */
  override loadTag(source: BattlerTag | any): void {
    super.loadTag(source);
    this.ability = source.ability as AbilityId;
  }
}
