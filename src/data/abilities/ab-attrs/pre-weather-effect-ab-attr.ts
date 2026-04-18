import { AbAttr } from "#abilities/ab-attr";
import type { PreWeatherEffectAbAttrParams } from "#types/ab-attr-param-types";

export abstract class PreWeatherEffectAbAttr extends AbAttr {
  public abstract override apply(params: PreWeatherEffectAbAttrParams): void;
}
