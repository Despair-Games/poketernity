import { AbAttr } from "#abilities/ab-attr";
import type { CancelledAbAttrParams } from "#types/ab-attr-param-types";

/**
 * Ability attribute that allows the ability holder to ignore the speed reduction from Paralysis.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Quick_Feet_(Ability)}
 */
export class BypassParaSpeedReductionAbAttr extends AbAttr {
  protected override readonly abAttrKey = "BypassParaSpeedReductionAbAttr";

  public override apply({ cancelled }: CancelledAbAttrParams): void {
    cancelled.value = true;
  }
}
