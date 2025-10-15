import { BattlerTag } from "#battler-tags/battler-tag";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

/**
 * Tag to double the power of {@link https://bulbapedia.bulbagarden.net/wiki/Pursuit_(move) | Pursuit}
 * when used against a retreating Pokemon.
 * @todo Can this be consolidated with `MeFirstPowerBoostTag`?
 */
export class PursuingTag extends BattlerTag {
  constructor() {
    super(BattlerTagType.PURSUING, BattlerTagLapseType.AFTER_MOVE, 1);
  }

  public override apply(_pokemon: Pokemon, _simulated: boolean, power: ValueHolder<number>): boolean {
    power.value *= 2;
    return true;
  }
}
