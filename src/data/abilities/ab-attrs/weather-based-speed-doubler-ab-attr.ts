import { EffectiveStatMultiplier } from "#abilities/effective-stat-multiplier-ab-attr";
import type { BattleStat } from "#enums/stat";
import { Stat } from "#enums/stat";
import type { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { getWeatherCondition } from "#utils/ability-utils";
import type { NumberHolder } from "#utils/common-utils";

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
  private readonly weatherTypes: readonly [WeatherType, ...WeatherType[]];

  constructor(...weatherTypes: readonly [WeatherType, ...WeatherType[]]) {
    super(Stat.SPD, 2);
    this.weatherTypes = weatherTypes;
  }

  public override apply(
    pokemon: Pokemon,
    simulated: boolean,
    stat: BattleStat,
    statValue: NumberHolder,
    move: Move,
  ): boolean {
    if (getWeatherCondition(...this.weatherTypes)(pokemon)) {
      return super.apply(pokemon, simulated, stat, statValue, move);
    }
    return false;
  }
}
