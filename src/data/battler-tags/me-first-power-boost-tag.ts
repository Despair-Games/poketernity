import { BattlerTag } from "#battler-tags/battler-tag";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Tag to boost the power of moves invoked by
 * {@link https://bulbapedia.bulbagarden.net/wiki/Me_First_(move) | Me First} by 50%
 */
export class MeFirstPowerBoostTag extends BattlerTag {
  constructor() {
    super(BattlerTagType.ME_FIRST_POWER_BOOST, BattlerTagLapseType.AFTER_MOVE, 1, MoveId.ME_FIRST);
  }

  override apply(_pokemon: Pokemon, _simulated: boolean, power: NumberHolder): boolean {
    power.value *= 1.5;
    return true;
  }
}
