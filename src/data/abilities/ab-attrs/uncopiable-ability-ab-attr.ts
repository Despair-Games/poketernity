import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbAttr } from "#app/data/abilities/ab-attrs/ab-attr";

export class UncopiableAbilityAbAttr extends AbAttr {
  constructor() {
    super(false);
    this._flags.add(AbAttrFlag.UNCOPIABLE_ABILITY);
  }
}
