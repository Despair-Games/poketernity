import type { AbAttrCondition } from "#app/@types/AbAttrCondition";
import type Pokemon from "#app/field/pokemon";
import type { WeatherType } from "#enums/weather-type";
import { getWeatherCondition } from "../ability";
import type { Weather } from "../weather";
import { AbAttr } from "./ab-attr";

export class PostWeatherLapseAbAttr extends AbAttr {
  protected weatherTypes: WeatherType[];

  constructor(...weatherTypes: WeatherType[]) {
    super();

    this.weatherTypes = weatherTypes;
  }

  applyPostWeatherLapse(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _weather: Weather | null,
    _args: any[],
  ): boolean {
    return false;
  }

  override getCondition(): AbAttrCondition {
    return getWeatherCondition(...this.weatherTypes);
  }
}
