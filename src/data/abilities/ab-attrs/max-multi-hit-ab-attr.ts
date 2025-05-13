import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { NumberHolder } from "#utils/common-utils";

export class MaxMultiHitAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.MAX_MULTI_HIT);
  }

  override apply(_pokemon: Pokemon, _simulated: boolean, hitValue: NumberHolder): boolean {
    hitValue.value = 0;

    return true;
  }
}
