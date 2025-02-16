import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbAttr } from "./ab-attr";

export class UnsuppressableAbilityAbAttr extends AbAttr {
  constructor() {
    super(false);
    this._flags.add(AbAttrFlag.UNSUPPRESSABLE_ABILITY);
  }
}
