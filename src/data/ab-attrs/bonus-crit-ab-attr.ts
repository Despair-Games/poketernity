import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbAttr } from "./ab-attr";

export class BonusCritAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.BONUS_CRIT);
  }

  override apply(_pokemon: Pokemon, _simulated: boolean, bonusCrit: BooleanHolder): boolean {
    bonusCrit.value = true;
    return true;
  }
}
