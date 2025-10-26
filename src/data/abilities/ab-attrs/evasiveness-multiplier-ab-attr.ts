import { AbAttr } from "#abilities/ab-attr";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

/**
 * Ability attribute to multiply the source Pokemon's {@link Stat.EVA | evasiveness}.
 * This is usually combined with an external {@linkcode Ability.condition | condition},
 * e.g. for {@link https://bulbapedia.bulbagarden.net/wiki/Sand_Veil_(Ability) | Sand Veil}
 */
export class EvasivenessMultiplierAbAttr extends AbAttr {
  protected override readonly abAttrKey = "EvasivenessMultiplierAbAttr";
  protected readonly multiplier: number;

  constructor(multiplier: number) {
    super();

    this.multiplier = multiplier;
  }

  public override apply(_pokemon: Pokemon, _simulated: boolean, evasivenessMultiplier: ValueHolder<number>): void {
    evasivenessMultiplier.value *= this.multiplier;
  }
}
