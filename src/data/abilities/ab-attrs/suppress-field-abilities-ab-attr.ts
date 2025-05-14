import { AbAttr } from "#abilities/ab-attr";
import type { Ability } from "#abilities/ability";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { BooleanHolder } from "#utils/common-utils";

export class SuppressFieldAbilitiesAbAttr extends AbAttr {
  constructor() {
    super(false);
    this._flags.add(AbAttrFlag.SUPPRESS_FIELD_ABILITIES);
  }

  override apply(_pokemon: Pokemon, _simulated: boolean, suppressed: BooleanHolder, ability: Ability): boolean {
    if (
      !ability.hasAttrFlag(AbAttrFlag.UNSUPPRESSABLE_ABILITY)
      && !ability.hasAttrFlag(AbAttrFlag.SUPPRESS_FIELD_ABILITIES)
    ) {
      suppressed.value = true;
      return true;
    }
    return false;
  }
}
