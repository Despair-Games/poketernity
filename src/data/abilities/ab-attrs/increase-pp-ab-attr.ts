import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";

export class IncreasePpAbAttr extends AbAttr {
  constructor() {
    super();
    this._flags.add(AbAttrFlag.INCREASE_PP);
  }
}
