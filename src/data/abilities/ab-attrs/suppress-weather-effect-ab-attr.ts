import { PreWeatherEffectAbAttr } from "#abilities/pre-weather-effect-ab-attr";
import type { Weather } from "#data/weather";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

export class SuppressWeatherEffectAbAttr extends PreWeatherEffectAbAttr {
  constructor() {
    super();
    this._flags.add(AbAttrFlag.SUPPRESS_WEATHER_EFFECT);
  }

  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _weather: Weather,
    cancelled: ValueHolder<boolean>,
  ): void {
    cancelled.value = true;
  }
}
