import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import { BattlerTag } from "#battler-tags/battler-tag";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";
import { ValueHolder } from "#utils/common-utils";

/**
 * Tag to allow the affected Pokemon's move to go first in its priority bracket.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Quick_Draw_(Ability)}
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Quick_Claw}
 */
export class BypassSpeedTag extends BattlerTag {
  constructor() {
    super(BattlerTagType.BYPASS_SPEED, BattlerTagLapseType.TURN_END, 1);
  }

  override canAdd(pokemon: Pokemon): boolean {
    const cancelled = new ValueHolder(false);
    applyAbAttrs("PreventBypassSpeedChanceAbAttr", { pokemon, simulated: false, cancelled });
    return !cancelled.value;
  }
}
