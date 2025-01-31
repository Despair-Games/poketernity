import { type Ability } from "#app/data/ability";
import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { AbAttrId } from "#enums/ab-attr-id";
import { AbAttr } from "./ab-attr";

export class SuppressFieldAbilitiesAbAttr extends AbAttr {
  constructor() {
    super(false);
    this._id = AbAttrId.SUPPRESS_FIELD_ABILITIES;
  }

  override apply(_pokemon: Pokemon, _simulated: boolean, suppressed: BooleanHolder, ability: Ability): boolean {
    if (!ability.hasAttr(AbAttrId.UNSUPPRESSABLE_ABILITY) && !ability.hasAttr(AbAttrId.SUPPRESS_FIELD_ABILITIES)) {
      suppressed.value = true;
      return true;
    }
    return false;
  }
}
