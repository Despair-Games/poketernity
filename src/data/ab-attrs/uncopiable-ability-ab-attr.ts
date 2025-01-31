import { AbAttrId } from "#enums/ab-attr-id";
import { AbAttr } from "./ab-attr";

export class UncopiableAbilityAbAttr extends AbAttr {
  constructor() {
    super(false);
    this._id = AbAttrId.UNCOPIABLE_ABILITY;
  }
}
