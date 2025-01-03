import type { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";

/**
 * Attribute used for moves which ignore type-based debuffs from weather, namely Hydro Steam.
 * Called during damage calculation after getting said debuff from getAttackTypeMultiplier in the Pokemon class.
 * @extends MoveAttr
 * @see {@linkcode apply}
 */

export class IgnoreWeatherTypeDebuffAttr extends MoveAttr {
  /** The {@linkcode WeatherType} this move ignores */
  public weather: WeatherType;

  constructor(weather: WeatherType) {
    super();
    this.weather = weather;
  }
  /**
   * Changes the type-based weather modifier if this move's power would be reduced by it
   * @param _user {@linkcode Pokemon} that used the move
   * @param _target N/A
   * @param _move {@linkcode Move} with this attribute
   * @param args [0] {@linkcode NumberHolder} for arenaAttackTypeMultiplier
   * @returns true if the function succeeds
   */
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, args: any[]): boolean {
    const weatherModifier = args[0] as NumberHolder;
    //If the type-based attack power modifier due to weather (e.g. Water moves in Sun) is below 1, set it to 1
    if (globalScene.arena.weather?.weatherType === this.weather) {
      weatherModifier.value = Math.max(weatherModifier.value, 1);
    }
    return true;
  }
}
