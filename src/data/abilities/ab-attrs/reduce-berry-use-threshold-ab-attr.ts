import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbAttr } from "./ab-attr";

export class ReduceBerryUseThresholdAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.REDUCE_BERRY_USE_THRESHOLD);
  }

  override apply(pokemon: Pokemon, _simulated: boolean, threshold: NumberHolder): boolean {
    const hpRatio = pokemon.getHpRatio();

    if (threshold.value < hpRatio) {
      threshold.value *= 2;
      return threshold.value >= hpRatio;
    }

    return false;
  }
}
