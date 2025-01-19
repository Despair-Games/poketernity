import { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { Move } from "#app/data/move";
import { HealAttr } from "#app/data/move-attrs/heal-attr";

/**
 * Attribute to restore the user's HP.
 * The heal ratio varies based on the active weather.
 * @extends HealAttr
 * @abstract
 * @see {@linkcode getWeatherHealRatio}
 */
export abstract class WeatherHealAttr extends HealAttr {
  constructor() {
    super(0.5);
  }

  protected override getHealRatio(_user: Pokemon, _target: Pokemon, _move: Move): number {
    if (!globalScene.arena.weather?.isEffectSuppressed()) {
      const weatherType = globalScene.arena.weather?.weatherType || WeatherType.NONE;
      return this.getWeatherHealRatio(weatherType);
    }
    return 0.5;
  }

  abstract getWeatherHealRatio(weatherType: WeatherType): number;
}
