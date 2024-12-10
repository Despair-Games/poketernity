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
    if (
      this.weatherType === WeatherType.HEAVY_RAIN
      || this.weatherType === WeatherType.HARSH_SUN
      || this.weatherType === WeatherType.STRONG_WINDS
      || !globalScene.arena.weather?.isImmutable()
    ) {
      if (simulated) {
        return globalScene.arena.weather?.weatherType !== this.weatherType;
      } else {
        return globalScene.arena.trySetWeather(this.weatherType, true);
      }
    }

    return false;
  }
}
