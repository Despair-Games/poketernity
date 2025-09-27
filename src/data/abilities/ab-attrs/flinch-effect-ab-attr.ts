import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";

export class FlinchEffectAbAttr extends AbAttr {
  constructor() {
    super(true);
    this._flags.add(AbAttrFlag.FLINCH_EFFECT);
  }
}
