import { AbAttr } from "#abilities/ab-attr";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

export class StatStageChangeMultiplierAbAttr extends AbAttr {
  protected override readonly abAttrKey = "StatStageChangeMultiplierAbAttr";
  private readonly multiplier: number;

  constructor(multiplier: number) {
    super();

    this.multiplier = multiplier;
  }

  public override apply(_pokemon: Pokemon, _simulated: boolean, stages: ValueHolder<number>): void {
    stages.value *= this.multiplier;
  }
}
