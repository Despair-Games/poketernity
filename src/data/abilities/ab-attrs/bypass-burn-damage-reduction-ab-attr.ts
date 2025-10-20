import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

export class BypassBurnDamageReductionAbAttr extends AbAttr {
  constructor() {
    super();
    this._flags.add(AbAttrFlag.BYPASS_BURN_DAMAGE_REDUCTION);
  }

  public override apply(_pokemon: Pokemon, _simulated: boolean, cancelled: ValueHolder<boolean>): void {
    cancelled.value = true;
  }
}
