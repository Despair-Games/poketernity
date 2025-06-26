import { globalScene } from "#app/global-scene";
import type { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveAttr } from "#moves/move-attr";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute used for moves which ignore type-based debuffs from weather, namely Hydro Steam.
 * Called during damage calculation after getting said debuff from getAttackTypeMultiplier in the Pokemon class.
 * @see {@linkcode apply}
 */
export class IgnoreWeatherTypeDebuffAttr extends MoveAttr {
  /** The {@linkcode WeatherType} this move ignores */
  public weather: WeatherType;

  constructor(weather: WeatherType) {
    super();
    this.weather = weather;
  }

  override apply(_user: Pokemon, _target: Pokemon, _move: Move, weatherModifier: NumberHolder): boolean {
    //If the type-based attack power modifier due to weather (e.g. Water moves in Sun) is below 1, set it to 1
    if (globalScene.arena.hasWeather(this.weather)) {
      weatherModifier.value = Math.max(weatherModifier.value, 1);
    }
    return true;
  }
}
