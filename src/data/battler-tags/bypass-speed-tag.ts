import { applyAbAttrs } from "#app/data/abilities/apply-ab-attrs";
import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { Pokemon } from "#app/field/pokemon";
import { BooleanHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";

/**
 * Tag to allow the affected Pokemon's move to go first in its priority bracket.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Quick_Draw_(Ability) Quick Draw}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Quick_Claw Quick Claw}.
 * @extends BattlerTag
 */
export class BypassSpeedTag extends BattlerTag {
  constructor() {
    super(BattlerTagType.BYPASS_SPEED, BattlerTagLapseType.TURN_END, 1);
  }

  override canAdd(pokemon: Pokemon): boolean {
    const cancelled = new BooleanHolder(false);
    applyAbAttrs(AbAttrFlag.PREVENT_BYPASS_SPEED_CHANCE, pokemon, false, cancelled);
    return !cancelled.value;
  }
}
