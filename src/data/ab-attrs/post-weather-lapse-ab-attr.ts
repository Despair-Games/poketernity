import type { AbAttrCondition } from "#app/@types/AbAttrCondition";
import type { Weather } from "#app/data/weather";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { WeatherType } from "#enums/weather-type";
import { AbAttr } from "./ab-attr";

export abstract class PostWeatherLapseAbAttr extends AbAttr {
  protected readonly weatherTypes: WeatherType[];

  constructor(...weatherTypes: WeatherType[]) {
    super();
    this._flags.add(AbAttrFlag.POST_WEATHER_LAPSE);

    this.weatherTypes = weatherTypes;
  }

  /**
   * Applies an effect after the weather on the field lapses.
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param weather The {@linkcode Weather} on the field
   * @returns `true` if effects successfully apply
   */
  override apply(_pokemon: Pokemon, _simulated: boolean, _weather: Weather): boolean {
    return false;
  }

  override getCondition(): AbAttrCondition {
    return getWeatherCondition(...this.weatherTypes);
  }
}

//#region Helpers

export function getWeatherCondition(...weatherTypes: WeatherType[]): AbAttrCondition {
  return () => {
    if (!globalScene?.arena) {
      return false;
    }
    if (globalScene.arena.weather?.isEffectSuppressed()) {
      return false;
    }
    const weatherType = globalScene.arena.weather?.weatherType;
    return !!weatherType && weatherTypes.indexOf(weatherType) > -1;
  };
}

//#endregion
