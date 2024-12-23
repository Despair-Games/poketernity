import type { Weather } from "#app/data/weather";
import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import type { WeatherType } from "#enums/weather-type";
import { PreWeatherDamageAbAttr } from "./pre-weather-damage-ab-attr";

export class BlockWeatherDamageAttr extends PreWeatherDamageAbAttr {
  private readonly weatherTypes: WeatherType[];

  constructor(...weatherTypes: WeatherType[]) {
    super();

    this.weatherTypes = weatherTypes;
  }

  override applyPreWeatherEffect(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    weather: Weather,
    cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    if (!this.weatherTypes.length || this.weatherTypes.indexOf(weather?.weatherType) > -1) {
      cancelled.value = true;
    }

    return true;
  }
}
