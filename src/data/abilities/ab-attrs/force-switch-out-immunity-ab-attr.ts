import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbAttr } from "./ab-attr";

export class ForceSwitchOutImmunityAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.FORCE_SWITCH_OUT_IMMUNITY);
  }

  override apply(_pokemon: Pokemon, _simulated: boolean, cancelled: BooleanHolder): boolean {
    cancelled.value = true;
    return true;
  }
}
