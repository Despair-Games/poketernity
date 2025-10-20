import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

/**
 * Ability attribute used for abilites that change the ability owner's weight
 * Used for Heavy Metal (doubling weight) and Light Metal (halving weight)
 */
export class WeightMultiplierAbAttr extends AbAttr {
  private readonly multiplier: number;

  constructor(multiplier: number) {
    super();
    this._flags.add(AbAttrFlag.WEIGHT_MULTIPLIER);

    this.multiplier = multiplier;
  }

  public override apply(_pokemon: Pokemon, _simulated: boolean, weight: ValueHolder<number>): void {
    weight.value *= this.multiplier;
  }
}
