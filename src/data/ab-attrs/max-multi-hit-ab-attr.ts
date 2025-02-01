import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbAttr } from "./ab-attr";

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
