import type { Weather } from "#app/data/weather";
import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { PreWeatherEffectAbAttr } from "./pre-weather-effect-ab-attr";

export class SuppressWeatherEffectAbAttr extends PreWeatherEffectAbAttr {
  public readonly affectsPrimal: boolean;

  constructor(affectsPrimal: boolean = false) {
    super();
    this._flags.add(AbAttrFlag.SUPPRESS_WEATHER_EFFECT);

    this.affectsPrimal = affectsPrimal;
  }

  override apply(_pokemon: Pokemon, _simulated: boolean, weather: Weather, cancelled: BooleanHolder): boolean {
    if (this.affectsPrimal || weather.isPrimal()) {
      cancelled.value = true;
      return true;
    }

    return false;
  }
}
