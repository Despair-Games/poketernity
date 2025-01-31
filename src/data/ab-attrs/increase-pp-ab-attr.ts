import { AbAttrId } from "#enums/ab-attr-id";
import { AbAttr } from "./ab-attr";

export class IncreasePpAbAttr extends AbAttr {
  constructor() {
    super();
    this._id = AbAttrId.INCREASE_PP;
  }
}
