import { abAttrFlag } from "#enums/ab-attr-flag";
import { AbAttr } from "./ab-attr";

/** Attribute for abilities that allow moves that make contact to ignore protection (i.e. Unseen Fist) */
export class IgnoreProtectOnContactAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(abAttrFlag.IGNORE_PROTECT_ON_CONTACT);
  }
}
