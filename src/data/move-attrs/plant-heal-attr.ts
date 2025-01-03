import { WeatherType } from "#enums/weather-type";
import { WeatherHealAttr } from "#app/data/move-attrs/weather-heal-attr";

/**
 * Attribute to restore a portion of the user's maximum HP.
 * The heal ratio is 0.5 in clear weather, 2/3 in sunny weather,
 * and 0.25 in any other type of weather.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Synthesis_(move) Synthesis}.
 * @extends WeatherHealAttr
 */
export class PlantHealAttr extends WeatherHealAttr {
  getWeatherHealRatio(weatherType: WeatherType): number {
    switch (weatherType) {
      case WeatherType.SUNNY:
      case WeatherType.HARSH_SUN:
        return 2 / 3;
      case WeatherType.RAIN:
      case WeatherType.SANDSTORM:
      case WeatherType.HAIL:
      case WeatherType.SNOW:
      case WeatherType.HEAVY_RAIN:
        return 0.25;
      default:
        return 0.5;
    }
  }
}
