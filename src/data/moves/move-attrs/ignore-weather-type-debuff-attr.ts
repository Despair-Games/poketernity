import { globalScene } from "#app/global-scene";
import type { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveAttr } from "#moves/move-attr";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute used for moves which ignore type-based debuffs from weather.
 *
 * Used by {@link https://bulbapedia.bulbagarden.net/wiki/Hydro_Steam_(move)}
 */
export class IgnoreWeatherTypeDebuffAttr extends MoveAttr {
  /** The {@linkcode WeatherType} this move ignores */
  public readonly weather: WeatherType;

  constructor(weather: WeatherType) {
    super();
    this.weather = weather;
  }

  override apply(_user: Pokemon, _target: Pokemon, _move: Move, weatherModifier: NumberHolder): boolean {
    if (globalScene.arena.hasWeather(this.weather)) {
      weatherModifier.value = 1.5;
    }
    return true;
  }
}
