import { globalScene } from "#app/global-scene";
import type { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import type { MoveConditionFunc } from "#types/move-condition-func";

/**
 * Attribute to set weather of a specified type on the field.
 * @extends MoveEffectAttr
 */
export class WeatherChangeAttr extends MoveEffectAttr {
  private weatherType: WeatherType;

  constructor(weatherType: WeatherType) {
    super(true);

    this.weatherType = weatherType;
  }

  override applyEffect(_user: Pokemon, _target: Pokemon, _move: Move): boolean {
    return globalScene.arena.trySetWeather(this.weatherType, true);
  }

  override getCondition(): MoveConditionFunc {
    return (_user, _target, _move) => globalScene.arena.canSetWeather(this.weatherType);
  }
}
