import { AbAttr } from "#abilities/ab-attr";
import type { Pokemon } from "#app/field/pokemon";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { NumberHolder } from "#utils/common-utils";

export class MultCritAbAttr extends AbAttr {
  public readonly multAmount: number;

  constructor(multAmount: number) {
    super(true);
    this._flags.add(AbAttrFlag.MULT_CRIT);

    this.multAmount = multAmount;
  }

  override apply(_pokemon: Pokemon, _simulated: boolean, critMultiplier: NumberHolder): boolean {
    if (critMultiplier.value > 1) {
      critMultiplier.value *= this.multAmount;
      return true;
    }

    return false;
  }
}
