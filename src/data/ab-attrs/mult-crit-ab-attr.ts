import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

export class MultCritAbAttr extends AbAttr {
  public readonly multAmount: number;

  constructor(multAmount: number) {
    super(true);

    this.multAmount = multAmount;
  }

  override apply(_pokemon: Pokemon, _passive: boolean, _simulated: boolean, critMultiplier: NumberHolder): boolean {
    if (critMultiplier.value > 1) {
      critMultiplier.value *= this.multAmount;
      return true;
    }

    return false;
  }
}
