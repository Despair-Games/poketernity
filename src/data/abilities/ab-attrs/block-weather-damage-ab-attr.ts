import { PreWeatherDamageAbAttr } from "#abilities/pre-weather-damage-ab-attr";
import type { Weather } from "#data/weather";
import type { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";
import type { BooleanHolder } from "#utils/common-utils";

/**
 * Ability attribute that protects the holder against certain forms of weather damage
 * These abilities use this attribute:
 * ```
+-----------+----------------------------------+
|  Weather  |            Abilities             |
+-----------+----------------------------------+
| Sandstorm | Sand Veil, Sand Force, Sand Rush |
| Hail      | Ice Body, Snow Cloak             |
| All       | Overcoat                         |
+-----------+----------------------------------+
 * ```
 */
export class BlockWeatherDamageAbAttr extends PreWeatherDamageAbAttr {
  private readonly weatherTypes: WeatherType[];

  constructor(...weatherTypes: WeatherType[]) {
    super();

    this.weatherTypes = weatherTypes;
  }

  override apply(_pokemon: Pokemon, _simulated: boolean, weather: Weather, cancelled: BooleanHolder): boolean {
    if (this.weatherTypes.includes(weather.weatherType)) {
      cancelled.value = true;
    }

    return true;
  }
}
