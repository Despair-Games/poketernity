import { AbAttr } from "#abilities/ab-attr";
import type { PostWeatherChangeAbAttrParams } from "#types/ab-attr-param-types";

export abstract class PostWeatherChangeAbAttr extends AbAttr {
  protected override readonly abAttrKey = "PostWeatherChangeAbAttr";

  constructor() {
    super(true);
  }

  public abstract override apply(params: PostWeatherChangeAbAttrParams): void;
}
