import { AbAttrId } from "#enums/ab-attr-id";
import { AbAttr } from "./ab-attr";

export class UnswappableAbilityAbAttr extends AbAttr {
  constructor() {
    super(false);
    this._id = AbAttrId.UNSWAPPABLE_ABILITY;
  }
}
