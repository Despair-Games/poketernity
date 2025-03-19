import { type Ability } from "#app/data/abilities/ability";
import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbAttr } from "./ab-attr";

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
