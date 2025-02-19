import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { WeatherType } from "#enums/weather-type";
import { PostSummonAbAttr } from "./post-summon-ab-attr";

/**
 * Changes the weather if possible when a pokemon is summoned.
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
