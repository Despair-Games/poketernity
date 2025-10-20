import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

/**
 * Provides immunity to critical hits. \
 * These abilities use this attribute:
 * - Battle Armor
 * - Shell Armor (Identical to Battle Armor in functionality, just has a different name)
 */
export class BlockCritAbAttr extends AbAttr {
  constructor() {
    super();
    this._flags.add(AbAttrFlag.BLOCK_CRIT);
  }

  public override apply(_pokemon: Pokemon, _simulated: boolean, isCritical: ValueHolder<boolean>): void {
    isCritical.value = false;
  }

  public override canApply(...[, , isCritical]: Parameters<this["apply"]>): boolean {
    return isCritical.value;
  }
}
