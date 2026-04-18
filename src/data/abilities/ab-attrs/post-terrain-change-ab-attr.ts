import { AbAttr } from "#abilities/ab-attr";
import type { PostTerrainChangeAbAttrParams } from "#types/ab-attr-param-types";

export abstract class PostTerrainChangeAbAttr extends AbAttr {
  protected override readonly abAttrKey = "PostTerrainChangeAbAttr";

  constructor() {
    super(true);
  }

  public abstract override apply(params: PostTerrainChangeAbAttrParams): void;
}
