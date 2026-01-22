import { AbAttr } from "#abilities/ab-attr";
import type { MultCritAbAttrParams } from "#types/ab-attr-param-types";

export class MultCritAbAttr extends AbAttr {
  protected override readonly abAttrKey = "MultCritAbAttr";

  public readonly multAmount: number;

  constructor(multAmount: number) {
    super();

    this.multAmount = multAmount;
  }

  public override apply({ critMultiplier }: MultCritAbAttrParams): void {
    critMultiplier.value *= this.multAmount;
  }

  public override canApply({ critMultiplier }: Parameters<this["apply"]>[0]): boolean {
    return critMultiplier.value > 1;
  }
}
