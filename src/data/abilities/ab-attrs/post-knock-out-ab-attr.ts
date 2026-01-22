import { AbAttr } from "#abilities/ab-attr";
import type { PostKnockOutAbAttrParams } from "#types/ab-attr-param-types";

export abstract class PostKnockOutAbAttr extends AbAttr {
  protected override readonly abAttrKey = "PostKnockOutAbAttr";

  constructor() {
    super(true);
  }

  public abstract override apply(params: PostKnockOutAbAttrParams): void;
}
