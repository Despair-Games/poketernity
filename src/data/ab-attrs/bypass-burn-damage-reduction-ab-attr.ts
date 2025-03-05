import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbAttr } from "./ab-attr";

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
