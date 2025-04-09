import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { abAttrFlag } from "#enums/ab-attr-flag";
import { AbAttr } from "./ab-attr";

export class PreventBerryUseAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(abAttrFlag.PREVENT_BERRY_USE);
  }

  override apply(_pokemon: Pokemon, _simulated: boolean, cancelled: BooleanHolder): boolean {
    cancelled.value = true;

    return true;
  }
}
