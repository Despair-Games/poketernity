import { AbAttr } from "#abilities/ab-attr";
import type { CancelledAbAttrParams } from "#types/ab-attr-param-types";

export class BlockNonDirectDamageAbAttr extends AbAttr {
  protected override readonly abAttrKey = "BlockNonDirectDamageAbAttr";

  public override apply({ cancelled }: CancelledAbAttrParams): void {
    cancelled.value = true;
  }
}
