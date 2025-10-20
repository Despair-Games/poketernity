import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";

export class AlwaysHitAbAttr extends AbAttr {
  constructor() {
    super();
    this._flags.add(AbAttrFlag.ALWAYS_HIT);
  }
}
