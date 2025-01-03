import { WeatherType } from "#enums/weather-type";
import { WeatherHealAttr } from "#app/data/move-attrs/weather-heal-attr";

/**
 * Attribute to restore the user's HP.
 * The ratio of HP restored is increased when a Sandstorm is active.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Shore_Up_(move) Shore Up}.
 * @extends WeatherHealAttr
 */
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
