import { AbAttr } from "#abilities/ab-attr";
import type { PostDamageAbAttrParams } from "#types/ab-attr-param-types";

/** Triggers after the Pokemon takes any damage */
export abstract class PostDamageAbAttr extends AbAttr {
  protected override readonly abAttrKey = "PostDamageAbAttr";

  constructor() {
    super(true);
  }

  public abstract override apply(params: PostDamageAbAttrParams): void;
}
