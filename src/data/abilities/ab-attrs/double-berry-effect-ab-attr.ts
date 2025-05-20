import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { NumberHolder } from "#utils/common-utils";

export class DoubleBerryEffectAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.DOUBLE_BERRY_EFFECT);
  }

  public override apply(_pokemon: Pokemon, _simulated: boolean, berryEffect: NumberHolder): boolean {
    berryEffect.value *= 2;
    return true;
  }
}
