import type Pokemon from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { WeatherType } from "#enums/weather-type";
import { PostSummonAbAttr } from "./post-summon-ab-attr";

/**
 * Changes the weather if possible when a pokemon is summoned.
 * @param weatherType The {@linkcode WeatherType} to set
 * @extends PostSummonAbAttr
 */
export class PostSummonWeatherChangeAbAttr extends PostSummonAbAttr {
  private weatherType: WeatherType;

  constructor(weatherType: WeatherType) {
    super();

    this.weatherType = weatherType;
  }

  override applyPostSummon(_pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    if (simulated) {
      return globalScene.arena.weather?.weatherType !== this.weatherType;
    } else {
      return globalScene.arena.trySetWeather(this.weatherType, true);
    }
  }
}
