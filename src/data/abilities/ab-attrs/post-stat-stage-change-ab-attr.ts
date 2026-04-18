import { AbAttr } from "#abilities/ab-attr";
import type { PostStatStageChangeAbAttrParams } from "#types/ab-attr-param-types";

export abstract class PostStatStageChangeAbAttr extends AbAttr {
  protected override readonly abAttrKey = "PostStatStageChangeAbAttr";

  constructor() {
    super(true);
  }

  public abstract override apply(params: PostStatStageChangeAbAttrParams): void;
}
