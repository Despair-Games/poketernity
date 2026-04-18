import { AbAttr } from "#abilities/ab-attr";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";

/** Triggers after the Pokemon loses or consumes an item */
export abstract class PostItemLostAbAttr extends AbAttr {
  protected override readonly abAttrKey = "PostItemLostAbAttr";

  public abstract override apply(params: BaseAbAttrParams): void;
}
