import { AbAttr } from "#abilities/ab-attr";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";

export abstract class PostTurnAbAttr extends AbAttr {
  protected override readonly abAttrKey = "PostTurnAbAttr";

  constructor() {
    super(true);
  }

  public abstract override apply(params: BaseAbAttrParams): void;
}
