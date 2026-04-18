import { AbAttr } from "#abilities/ab-attr";
import type { PostDefendAbAttrParams } from "#types/ab-attr-param-types";
import type { AbAttrKey } from "#types/ability-types";

export abstract class PostDefendAbAttr extends AbAttr {
  protected override readonly abAttrKey: AbAttrKey = "PostDefendAbAttr";

  constructor() {
    super(true);
  }

  public abstract override apply(parms: PostDefendAbAttrParams): void;
}
