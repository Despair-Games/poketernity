import { AbAttrId } from "#enums/ab-attr-id";
import { AbAttr } from "./ab-attr";

export class IgnoreContactAbAttr extends AbAttr {
  constructor() {
    super();
    this._id = AbAttrId.IGNORE_CONTACT;
  }
}
