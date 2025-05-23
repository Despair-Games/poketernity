import { PreWeatherEffectAbAttr } from "#abilities/pre-weather-effect-ab-attr";
import type { Weather } from "#data/weather";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { BooleanHolder } from "#utils/common-utils";

export class SuppressWeatherEffectAbAttr extends PreWeatherEffectAbAttr {
  public readonly affectsPrimal: boolean;

  constructor(affectsPrimal: boolean = false) {
    super();
    this._flags.add(AbAttrFlag.SUPPRESS_WEATHER_EFFECT);

    this.affectsPrimal = affectsPrimal;
  }

  public override apply(_pokemon: Pokemon, _simulated: boolean, weather: Weather, cancelled: BooleanHolder): boolean {
    if (this.affectsPrimal || weather.isPrimal()) {
      cancelled.value = true;
      return true;
    }

    return false;
  }
}
