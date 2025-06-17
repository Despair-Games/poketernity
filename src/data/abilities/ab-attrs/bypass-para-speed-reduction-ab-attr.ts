import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { BooleanHolder } from "#utils/common-utils";

/**
 * Ability attribute that allows the ability holder to ignore the speed reduction from Paralysis.
 * Used by the ability Quick Feet
 */
export class BypassParaSpeedReductionAbAttr extends AbAttr {
  constructor() {
    super(false);
    this._flags.add(AbAttrFlag.BYPASS_PARA_SPEED_REDUCTION);
  }

  public override apply(_pokemon: Pokemon, _simulated: boolean, cancelled: BooleanHolder): boolean {
    cancelled.value = true;
    return true;
  }
}
