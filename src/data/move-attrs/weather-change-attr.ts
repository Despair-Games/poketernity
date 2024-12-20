import type { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { Move, MoveConditionFunc } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

export class WeatherChangeAttr extends MoveEffectAttr {
  private weatherType: WeatherType;

  constructor(weatherType: WeatherType) {
    super();

    this.weatherType = weatherType;
  }

  override apply(_user: Pokemon, _target: Pokemon, _move: Move, _args: any[]): boolean {
    return globalScene.arena.trySetWeather(this.weatherType, true);
  }

  override getCondition(): MoveConditionFunc {
    return (_user, _target, _move) =>
      !globalScene.arena.weather
      || (globalScene.arena.weather.weatherType !== this.weatherType && !globalScene.arena.weather.isImmutable());
  }
}
