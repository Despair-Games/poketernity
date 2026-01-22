import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { globalScene } from "#app/global-scene";
import type { WeatherType } from "#enums/weather-type";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";

/**
 * Changes the weather, if possible, when a pokemon is summoned. \
 * Note: Primal weather can only be overwritten by other Primal weather.
 *
 * | Ability           | Weather               | Turns |
 * |:-----------------:|:---------------------:|:-----:|
 * | Drizzle           | Rain                  |   5   |
 * | Drought           | Sun                   |   5   |
 * | Orichalcum Pulse  | Sun                   |   5   |
 * | Sand Stream       | Sandstorm             |   5   |
 * | Snow Warning      | Hail                  |   5   |
 * | Desolate Land     | Harsh Sun (Primal)    |   ∞   |
 * | Primordial Sea    | Heavy Rain (Primal)   |   ∞   |
 * | Delta Stream      | Strong Winds (Primal) |   ∞   |
 *
 * @param weatherType The {@linkcode WeatherType} to set
 */
export class PostSummonWeatherChangeAbAttr extends PostSummonAbAttr {
  private readonly weatherType: WeatherType;

  constructor(weatherType: WeatherType) {
    super();

    this.weatherType = weatherType;
  }

  public override apply({ simulated }: BaseAbAttrParams): void {
    if (!simulated) {
      globalScene.arena.trySetWeather(this.weatherType, true);
    }
  }

  public override canApply(): boolean {
    return globalScene.arena.canSetWeather(this.weatherType);
  }
}
