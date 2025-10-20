import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";

export class BlockRedirectAbAttr extends AbAttr {
  constructor() {
    super();
    this._flags.add(AbAttrFlag.BLOCK_REDIRECT);
  }
}
