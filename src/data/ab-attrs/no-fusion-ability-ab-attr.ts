import { AbAttrId } from "#enums/ab-attr-id";
import { AbAttr } from "./ab-attr";

export class NoFusionAbilityAbAttr extends AbAttr {
  constructor() {
    super(false);
    this._id = AbAttrId.NO_FUSION_ABILITY;
  }
}
