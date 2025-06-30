import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { globalScene } from "#app/global-scene";
import type { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";

/**
 * Changes the weather, if possible, when a pokemon is summoned.
 *
 * | Ability           | Weather      | Turns | Notes              |
 * |-------------------|--------------|-------|--------------------|
 * | Drizzle           | Rain         |     5 |                    |
 * | Drought           | Sun          |     5 |                    |
 * | Sand Stream       | Sandstorm    |     5 |                    |
 * | Snow Warning      | Hail         |     5 |                    |
 * | Orichalcum Pulse  | Sun          |     5 |                    |
 * | Desolate Land     | Harsh Sun    |     ∞ | Primal (permanent) |
 * | Primordial Sea    | Heavy Rain   |     ∞ | Primal (permanent) |
 * | Delta Stream      | Strong Winds |     ∞ | Primal (permanent) |
 *
 * @param weatherType The {@linkcode WeatherType} to set
 */
export class PostSummonWeatherChangeAbAttr extends PostSummonAbAttr {
  private readonly weatherType: WeatherType;

  constructor(weatherType: WeatherType) {
    super();

    this.weatherType = weatherType;
  }

  public override apply(_pokemon: Pokemon, simulated: boolean): boolean {
    return simulated
      ? !globalScene.arena.hasWeather(this.weatherType)
      : globalScene.arena.trySetWeather(this.weatherType, true);
  }
}
