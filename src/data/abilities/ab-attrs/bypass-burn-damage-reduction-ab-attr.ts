import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { BooleanHolder } from "#utils/common-utils";

export class BypassBurnDamageReductionAbAttr extends AbAttr {
  constructor() {
    super(false);
    this._flags.add(AbAttrFlag.BYPASS_BURN_DAMAGE_REDUCTION);
  }

  override apply(_pokemon: Pokemon, _simulated: boolean, cancelled: BooleanHolder): boolean {
    cancelled.value = true;
    return true;
  }
}
