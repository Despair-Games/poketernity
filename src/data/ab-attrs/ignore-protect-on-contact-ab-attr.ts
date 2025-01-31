import { AbAttrId } from "#enums/ab-attr-id";
import { AbAttr } from "./ab-attr";

/** Attribute for abilities that allow moves that make contact to ignore protection (i.e. Unseen Fist) */
export class IgnoreProtectOnContactAbAttr extends AbAttr {
  constructor() {
    super();
    this._id = AbAttrId.IGNORE_PROTECT_ON_CONTACT;
  }
}
