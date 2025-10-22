import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

export class MultCritAbAttr extends AbAttr {
  public readonly multAmount: number;

  constructor(multAmount: number) {
    super();
    this._flags.add(AbAttrFlag.MULT_CRIT);

    this.multAmount = multAmount;
  }

  public override apply(_pokemon: Pokemon, _simulated: boolean, critMultiplier: ValueHolder<number>): void {
    critMultiplier.value *= this.multAmount;
  }

  public override canApply(...[, , critMultiplier]: Parameters<this["apply"]>): boolean {
    return critMultiplier.value > 1;
  }
}
