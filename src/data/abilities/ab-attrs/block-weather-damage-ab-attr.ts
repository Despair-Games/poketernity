import { PreWeatherDamageAbAttr } from "#abilities/pre-weather-damage-ab-attr";
import type { WeatherType } from "#enums/weather-type";
import type { PreWeatherEffectAbAttrParams } from "#types/ab-attr-param-types";
import type { NonEmptyArray } from "#types/utility-types";

/**
 * Ability attribute that protects the holder against certain forms of weather damage.
 *
 * Used by the following abilities:
 * ```
+-----------+----------------------------------+
|  Weather  |            Abilities             |
+-----------+----------------------------------+
| Sandstorm | Sand Veil, Sand Force, Sand Rush |
| Hail      | Ice Body, Snow Cloak             |
| Both      | Overcoat                         |
+-----------+----------------------------------+
 * ```
 */
export class BlockWeatherDamageAbAttr extends PreWeatherDamageAbAttr {
  private readonly weatherTypes: Readonly<NonEmptyArray<WeatherType>>;

  constructor(...weatherTypes: Readonly<NonEmptyArray<WeatherType>>) {
    super();

    this.weatherTypes = weatherTypes;
  }

  public override apply({ cancelled }: PreWeatherEffectAbAttrParams): void {
    cancelled.value = true;
  }

  public override canApply({ weather }: Parameters<this["apply"]>[0]): boolean {
    return this.weatherTypes.includes(weather.weatherType);
  }
}
