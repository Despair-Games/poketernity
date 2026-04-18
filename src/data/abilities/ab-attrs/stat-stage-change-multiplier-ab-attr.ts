import { AbAttr } from "#abilities/ab-attr";
import type { StatStageChangeMultiplierAbAttrParams } from "#types/ab-attr-param-types";

export class StatStageChangeMultiplierAbAttr extends AbAttr {
  protected override readonly abAttrKey = "StatStageChangeMultiplierAbAttr";

  private readonly multiplier: number;

  constructor(multiplier: number) {
    super();

    this.multiplier = multiplier;
  }

  public override apply({ stages }: StatStageChangeMultiplierAbAttrParams): void {
    stages.value *= this.multiplier;
  }
}
