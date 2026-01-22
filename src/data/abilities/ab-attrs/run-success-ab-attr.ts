import { AbAttr } from "#abilities/ab-attr";
import type { RunSuccessAbAttrParams } from "#types/ab-attr-param-types";

export class RunSuccessAbAttr extends AbAttr {
  protected override readonly abAttrKey = "RunSuccessAbAttr";

  public override apply({ escapeChance }: RunSuccessAbAttrParams): void {
    escapeChance.value = 256;
  }
}
