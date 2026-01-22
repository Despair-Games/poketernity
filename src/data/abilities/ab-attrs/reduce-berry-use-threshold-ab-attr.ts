import { AbAttr } from "#abilities/ab-attr";
import type { ReduceBerryUseThresholdAbAttrParams } from "#types/ab-attr-param-types";

export class ReduceBerryUseThresholdAbAttr extends AbAttr {
  protected override readonly abAttrKey = "ReduceBerryUseThresholdAbAttr";

  public override apply({ threshold }: ReduceBerryUseThresholdAbAttrParams): void {
    threshold.value *= 2;
  }
}
