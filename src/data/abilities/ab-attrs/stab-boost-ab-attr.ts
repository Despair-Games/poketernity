import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbAttr } from "./ab-attr";

export class StabBoostAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.STAB_BOOST);
  }

  override apply(_pokemon: Pokemon, _simulated: boolean, stabMultiplier: NumberHolder): boolean {
    if (stabMultiplier.value > 1) {
      stabMultiplier.value += 0.5;
      return true;
    }

    return false;
  }
}
