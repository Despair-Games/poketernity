import { PreWeatherEffectAbAttr } from "#abilities/pre-weather-effect-ab-attr";
import type { PreWeatherEffectAbAttrParams } from "#types/ab-attr-param-types";

export class SuppressWeatherEffectAbAttr extends PreWeatherEffectAbAttr {
  protected override readonly abAttrKey = "SuppressWeatherEffectAbAttr";

  public override apply({ cancelled }: PreWeatherEffectAbAttrParams): void {
    cancelled.value = true;
  }
}
