import { AbAttr } from "#abilities/ab-attr";
import type { DoubleBerryEffectAbAttrParams } from "#types/ab-attr-param-types";

export class DoubleBerryEffectAbAttr extends AbAttr {
  protected override readonly abAttrKey = "DoubleBerryEffectAbAttr";

  public override apply({ berryEffect }: DoubleBerryEffectAbAttrParams): void {
    berryEffect.value *= 2;
  }
}
