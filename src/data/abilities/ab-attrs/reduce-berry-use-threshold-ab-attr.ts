import { AbAttr } from "#abilities/ab-attr";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

export class ReduceBerryUseThresholdAbAttr extends AbAttr {
  protected override readonly abAttrKey = "ReduceBerryUseThresholdAbAttr";

  public override apply(_pokemon: Pokemon, _simulated: boolean, threshold: ValueHolder<number>): void {
    threshold.value *= 2;
  }
}
