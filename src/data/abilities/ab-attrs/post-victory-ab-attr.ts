import { AbAttr } from "#abilities/ab-attr";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";

export abstract class PostVictoryAbAttr extends AbAttr {
  protected override readonly abAttrKey = "PostVictoryAbAttr";

  constructor() {
    super(true);
  }

  public abstract override apply(params: BaseAbAttrParams): void;
}
