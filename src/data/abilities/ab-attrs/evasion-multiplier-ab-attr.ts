import { AbAttr } from "#abilities/ab-attr";
import type { Stat } from "#enums/stat";
import type { EvasionMultiplierAbAttrParams } from "#types/ab-attr-param-types";

/**
 * Ability attribute to multiply the source Pokemon's {@link Stat.EVA | evasion}. \
 * This is usually combined with an external condition.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Sand_Veil_(Ability)} as an example
 */
export class EvasionMultiplierAbAttr extends AbAttr {
  protected override readonly abAttrKey = "EvasionMultiplierAbAttr";

  protected readonly multiplier: number;

  constructor(multiplier: number) {
    super();

    this.multiplier = multiplier;
  }

  public override apply({ evasionMultiplier }: EvasionMultiplierAbAttrParams): void {
    evasionMultiplier.value *= this.multiplier;
  }
}
