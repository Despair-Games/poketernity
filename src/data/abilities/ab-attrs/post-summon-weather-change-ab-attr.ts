import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { globalScene } from "#app/global-scene";
import type { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";

/**
 * Changes the weather, if possible, when a pokemon is summoned.
 *
 * | Ability           | Weather      | Turns | Notes              |
 * |-------------------|--------------|-------|--------------------|
 * | Drizzle           | Rain         |     5 | No primal override |
 * | Drought           | Sunny        |     5 | No primal override |
 * | Sand Stream       | Sandstorm    |     5 | No primal override |
 * | Snow Warning      | Hail         |     5 | No primal override |
 * | Desolate Land     | Harsh Sun    |     ∞ | Primal             |
 * | Primordial Sea    | Heavy Rain   |     ∞ | Primal             |
 * | Delta Stream      | Strong Winds |     ∞ | Primal             |
 * | Air Lock          | NONE         |     - | Suppresses all     |
 * | Cloud Nine        | NONE         |     - | Suppresses all     |
 * | Sand Spit         | Sandstorm    |     5 | Activates on hit   |
 * | Orichalcum Pulse  | Harsh Sun    |     ∞ | Primal             |
 *
 * @param weatherType The {@linkcode WeatherType} to set
 * @extends PostSummonAbAttr
 */
export class PostSummonWeatherChangeAbAttr extends PostSummonAbAttr {
  private readonly weatherType: WeatherType;

  constructor(weatherType: WeatherType) {
    super();

    this.weatherType = weatherType;
  }

  override apply(_pokemon: Pokemon, simulated: boolean): boolean {
    return simulated
      ? !globalScene.arena.hasWeather(this.weatherType)
      : globalScene.arena.trySetWeather(this.weatherType, true);
  }
}
