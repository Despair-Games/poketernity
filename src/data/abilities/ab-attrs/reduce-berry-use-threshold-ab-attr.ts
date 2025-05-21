import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { NumberHolder } from "#utils/common-utils";

export class ReduceBerryUseThresholdAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.REDUCE_BERRY_USE_THRESHOLD);
  }

  public override apply(pokemon: Pokemon, _simulated: boolean, threshold: NumberHolder): boolean {
    const hpRatio = pokemon.getHpRatio();

    if (threshold.value < hpRatio) {
      threshold.value *= 2;
      return threshold.value >= hpRatio;
    }

    return false;
  }
}
