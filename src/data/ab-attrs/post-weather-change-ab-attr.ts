import type { Pokemon } from "#app/field/pokemon";
import type { WeatherType } from "#enums/weather-type";
import { AbAttr } from "./ab-attr";

export class PostWeatherChangeAbAttr extends AbAttr {
  /**
   * Applies an effect after the weather on the field changes
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param weather The {@linkcode Weather} being set on the field
   * @returns `true` if the ability's effect applies successfully
   */
  override apply(_pokemon: Pokemon, _simulated: boolean, _weather: WeatherType): boolean {
    return false;
  }
}
