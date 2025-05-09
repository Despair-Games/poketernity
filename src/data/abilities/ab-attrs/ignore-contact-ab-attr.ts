import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbAttr } from "#app/data/abilities/ab-attrs/ab-attr";

export class IgnoreContactAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.IGNORE_CONTACT);
  }
}
