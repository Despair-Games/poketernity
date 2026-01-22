import { AbAttr } from "#abilities/ab-attr";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";

export abstract class PostBattleInitAbAttr extends AbAttr {
  protected override readonly abAttrKey = "PostBattleInitAbAttr";

  constructor() {
    super(true);
  }

  public abstract override apply(params: BaseAbAttrParams): void;
}
