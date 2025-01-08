import type { Pokemon } from "#app/field/pokemon";
import type { WeatherType } from "#enums/weather-type";
import { AbAttr } from "./ab-attr";

export class PostWeatherChangeAbAttr extends AbAttr {
  applyPostWeatherChange(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _weather: WeatherType,
    ..._args: unknown[]
  ): boolean {
    return false;
  }
}
