import { EffectiveStatMultiplier } from "#abilities/effective-stat-multiplier-ab-attr";
import { Stat } from "#enums/stat";
import type { WeatherType } from "#enums/weather-type";
import { getWeatherCondition } from "#utils/ability-utils";

/**
 * Ability attribute that doubles speed if specific weather(s) are active
 * Abilities with this attribute:
 * ```
+-------------+------------------+
|   Ability   |    Weather(s)    |
+-------------+------------------+
| Chlorophyll | Sun, Harsh Sun   |
| Swift Swim  | Rain, Heavy Rain |
| Sand Rush   | Sandstorm        |
| Slush Rush  | Hail, Snow       |
+-------------+------------------+
 * ```
 */
export class WeatherBasedSpeedDoublerAbAttr extends EffectiveStatMultiplier {
  private readonly weatherTypes: readonly WeatherType[];

  constructor(...weatherTypes: readonly WeatherType[]) {
    super(Stat.SPD, 2);
    this.weatherTypes = weatherTypes;
  }

  public override canApply(...params: Parameters<this["apply"]>): boolean {
    const [pokemon] = params;
    return super.canApply(...params) && getWeatherCondition(...this.weatherTypes)(pokemon);
  }
}
