import { AbAttr } from "#abilities/ab-attr";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

export class DoubleBerryEffectAbAttr extends AbAttr {
  protected override readonly abAttrKey = "DoubleBerryEffectAbAttr";

  public override apply(_pokemon: Pokemon, _simulated: boolean, berryEffect: ValueHolder<number>): void {
    berryEffect.value *= 2;
  }
}
