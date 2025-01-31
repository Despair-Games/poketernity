import { AbAttrId } from "#enums/ab-attr-id";
import { AbAttr } from "./ab-attr";

export class BlockRedirectAbAttr extends AbAttr {
  constructor() {
    super();
    this._id = AbAttrId.BLOCK_REDIRECT;
  }
}
