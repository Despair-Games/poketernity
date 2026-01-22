import { AbAttr } from "#abilities/ab-attr";
import type { PostBattleAbAttrParams } from "#types/ab-attr-param-types";

export abstract class PostBattleAbAttr extends AbAttr {
  protected override readonly abAttrKey = "PostBattleAbAttr";

  constructor() {
    super(true);
  }

  public abstract override apply(params: PostBattleAbAttrParams): void;
}
