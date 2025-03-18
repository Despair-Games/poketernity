import { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { Move } from "#app/data/moves/move";
import { MoveEffectAttr } from "#app/data/moves/move-attrs/move-effect-attr";

/**
 * Attribute to clear active weather of a given type from the field.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Defog_(move) | Defog}.
 * @extends MoveEffectAttr
 */
export class ClearWeatherAttr extends MoveEffectAttr {
  private weatherType: WeatherType;

  constructor(weatherType: WeatherType) {
    super();

    this.weatherType = weatherType;
  }

  override applyEffect(_user: Pokemon, _target: Pokemon, _move: Move): boolean {
    if (globalScene.arena.hasWeather(this.weatherType)) {
      return globalScene.arena.trySetWeather(WeatherType.NONE, true);
    }

    return false;
  }
}
