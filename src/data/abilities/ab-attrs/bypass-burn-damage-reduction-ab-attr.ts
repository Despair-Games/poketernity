import { AbAttr } from "#abilities/ab-attr";
import type { CancelledAbAttrParams } from "#types/ab-attr-param-types";

export class BypassBurnDamageReductionAbAttr extends AbAttr {
  protected override readonly abAttrKey = "BypassBurnDamageReductionAbAttr";

  public override apply({ cancelled }: CancelledAbAttrParams): void {
    cancelled.value = true;
  }
}
