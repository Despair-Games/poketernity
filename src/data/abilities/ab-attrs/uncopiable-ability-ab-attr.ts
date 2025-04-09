import { abAttrFlag } from "#enums/ab-attr-flag";
import { AbAttr } from "./ab-attr";

export class UncopiableAbilityAbAttr extends AbAttr {
  constructor() {
    super(false);
    this._flags.add(abAttrFlag.UNCOPIABLE_ABILITY);
  }
}
