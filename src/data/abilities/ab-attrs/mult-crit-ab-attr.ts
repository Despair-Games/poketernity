import { AbAttr } from "#abilities/ab-attr";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

export class MultCritAbAttr extends AbAttr {
  protected override readonly abAttrKey = "MultCritAbAttr";
  public readonly multAmount: number;

  constructor(multAmount: number) {
    super();

    this.multAmount = multAmount;
  }

  public override apply(_pokemon: Pokemon, _simulated: boolean, critMultiplier: ValueHolder<number>): void {
    critMultiplier.value *= this.multAmount;
  }

  public override canApply(...[, , critMultiplier]: Parameters<this["apply"]>): boolean {
    return critMultiplier.value > 1;
  }
}
