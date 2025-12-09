import { AbAttr } from "#abilities/ab-attr";

export class FlinchEffectAbAttr extends AbAttr {
  protected override readonly abAttrKey = "FlinchEffectAbAttr";

  constructor() {
    super(true);
  }
}
