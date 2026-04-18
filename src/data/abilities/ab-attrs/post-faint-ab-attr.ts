import { AbAttr } from "#abilities/ab-attr";
import type { PostFaintAbAttrParams } from "#types/ab-attr-param-types";

export abstract class PostFaintAbAttr extends AbAttr {
  protected override readonly abAttrKey = "PostFaintAbAttr";

  constructor() {
    super(true);
  }

  public abstract override apply(params: PostFaintAbAttrParams): void;
}
