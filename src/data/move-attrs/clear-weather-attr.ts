import { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

export class ClearWeatherAttr extends MoveEffectAttr {
  private weatherType: WeatherType;

  constructor(weatherType: WeatherType) {
    super();

    this.weatherType = weatherType;
  }

  override apply(_user: Pokemon, _target: Pokemon, _move: Move, _args: any[]): boolean {
    if (globalScene.arena.weather?.weatherType === this.weatherType) {
      return globalScene.arena.trySetWeather(WeatherType.NONE, true);
    }

    return false;
  }
}
