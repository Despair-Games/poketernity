import { WeatherType } from "#enums/weather-type";
import { WeatherHealAttr } from "#app/data/move-attrs/weather-heal-attr";

export class SandHealAttr extends WeatherHealAttr {
  getWeatherHealRatio(weatherType: WeatherType): number {
    switch (weatherType) {
      case WeatherType.SANDSTORM:
        return 2 / 3;
      default:
        return 0.5;
    }
  }
}
