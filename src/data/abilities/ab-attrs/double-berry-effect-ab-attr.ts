import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

export class DoubleBerryEffectAbAttr extends AbAttr {
  constructor() {
    super();
    this._flags.add(AbAttrFlag.DOUBLE_BERRY_EFFECT);
  }

  public override apply(_pokemon: Pokemon, _simulated: boolean, berryEffect: ValueHolder<number>): void {
    berryEffect.value *= 2;
  }
}
