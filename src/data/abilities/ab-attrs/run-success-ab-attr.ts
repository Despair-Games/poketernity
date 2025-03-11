import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbAttr } from "./ab-attr";

export class RunSuccessAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.RUN_SUCCESS);
  }

  override apply(_pokemon: Pokemon, _simulated: boolean, escapeChance: NumberHolder): boolean {
    escapeChance.value = 256;
    return true;
  }
}
