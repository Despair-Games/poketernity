import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";

export class IgnoreContactAbAttr extends AbAttr {
  constructor() {
    super();
    this._flags.add(AbAttrFlag.IGNORE_CONTACT);
  }
}
