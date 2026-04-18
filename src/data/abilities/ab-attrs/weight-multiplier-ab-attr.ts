import { AbAttr } from "#abilities/ab-attr";
import type { WeightMultiplierAbAttrParams } from "#types/ab-attr-param-types";

/**
 * Multiplies the ability holder's weight
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Heavy_Metal_(Ability)}
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Light_Metal_(Ability)}
 */
export class WeightMultiplierAbAttr extends AbAttr {
  protected override readonly abAttrKey = "WeightMultiplierAbAttr";

  private readonly multiplier: number;

  constructor(multiplier: number) {
    super();

    this.multiplier = multiplier;
  }

  public override apply({ weight }: WeightMultiplierAbAttrParams): void {
    weight.value *= this.multiplier;
  }
}
