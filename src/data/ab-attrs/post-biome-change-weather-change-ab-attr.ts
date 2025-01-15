import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { WeatherType } from "#enums/weather-type";
import { PostBiomeChangeAbAttr } from "./post-biome-change-ab-attr";

export class PostBiomeChangeWeatherChangeAbAttr extends PostBiomeChangeAbAttr {
  private readonly weatherType: WeatherType;

  constructor(weatherType: WeatherType) {
    super();

    this.weatherType = weatherType;
  }

  override apply(_pokemon: Pokemon, simulated: boolean): boolean {
    if (!globalScene.arena.weather?.isImmutable()) {
      if (simulated) {
        return globalScene.arena.weather?.weatherType !== this.weatherType;
      } else {
        return globalScene.arena.trySetWeather(this.weatherType, true);
      }
    }

    return false;
  }
}
