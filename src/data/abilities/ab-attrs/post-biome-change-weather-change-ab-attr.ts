import { PostBiomeChangeAbAttr } from "#abilities/post-biome-change-ab-attr";
import { globalScene } from "#app/global-scene";
import type { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";

export class PostBiomeChangeWeatherChangeAbAttr extends PostBiomeChangeAbAttr {
  private readonly weatherType: WeatherType;

  constructor(weatherType: WeatherType) {
    super();

    this.weatherType = weatherType;
  }

  public override apply(_pokemon: Pokemon, simulated: boolean): void {
    if (!simulated) {
      globalScene.arena.trySetWeather(this.weatherType, true);
    }
  }

  public override canApply(..._params: Parameters<this["apply"]>): boolean {
    return globalScene.arena.canSetWeather(this.weatherType);
  }
}
