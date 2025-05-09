import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";

export class UnswappableAbilityAbAttr extends AbAttr {
  constructor() {
    super(false);
    this._flags.add(AbAttrFlag.UNSWAPPABLE_ABILITY);
  }
}
