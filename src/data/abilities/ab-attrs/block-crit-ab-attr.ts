import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbAttr } from "./ab-attr";

/**
 * Provides immunity to critical hits
 * These abilities use this attribute:
 * - Battle Armor
 * - Shell Armor (Identical to Battle Armor in functionality, just has a different name)
 * @extends AbAttr
 */
export class BlockCritAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.BLOCK_CRIT);
  }

  override apply(_pokemon: Pokemon, _simulated: boolean, isCritical: BooleanHolder): boolean {
    if (isCritical.value) {
      isCritical.value = false;
      return true;
    }
    return false;
  }
}
