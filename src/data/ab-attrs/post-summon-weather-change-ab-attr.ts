import type Pokemon from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { WeatherType } from "#enums/weather-type";
import { PostSummonAbAttr } from "./post-summon-ab-attr";

export class PostSummonWeatherChangeAbAttr extends PostSummonAbAttr {
  private weatherType: WeatherType;

  constructor(weatherType: WeatherType) {
    super();

    this.weatherType = weatherType;
  }

  override applyPostSummon(_pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    // TODO: This seems backwards, shouldn't it check that it's not one of these weathers?
    const legendaryWeather = [WeatherType.HEAVY_RAIN, WeatherType.HARSH_SUN, WeatherType.STRONG_WINDS];
    if (legendaryWeather.includes(this.weatherType) || !globalScene.arena.weather?.isImmutable()) {
      if (simulated) {
        return globalScene.arena.weather?.weatherType !== this.weatherType;
      } else {
        return globalScene.arena.trySetWeather(this.weatherType, true);
      }
    }

    return false;
  }
}
