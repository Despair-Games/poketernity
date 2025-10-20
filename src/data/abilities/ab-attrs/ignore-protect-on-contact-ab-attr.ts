import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";

/** Attribute for abilities that allow moves that make contact to ignore protection (i.e. Unseen Fist) */
export class IgnoreProtectOnContactAbAttr extends AbAttr {
  constructor() {
    super();
    this._flags.add(AbAttrFlag.IGNORE_PROTECT_ON_CONTACT);
  }
}
