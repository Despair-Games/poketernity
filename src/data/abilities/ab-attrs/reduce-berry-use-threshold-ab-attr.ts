import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

export class ReduceBerryUseThresholdAbAttr extends AbAttr {
  constructor() {
    super();
    this._flags.add(AbAttrFlag.REDUCE_BERRY_USE_THRESHOLD);
  }

  public override apply(_pokemon: Pokemon, _simulated: boolean, threshold: ValueHolder<number>): void {
    threshold.value *= 2;
  }
}
