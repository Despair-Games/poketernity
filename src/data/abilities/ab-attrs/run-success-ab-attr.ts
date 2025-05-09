import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { NumberHolder } from "#utils/common-utils";

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
