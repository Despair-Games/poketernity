import type { AbAttrCondition } from "#app/@types/AbAttrCondition";
import type { Weather } from "#app/data/weather";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { WeatherType } from "#enums/weather-type";
import { AbAttr } from "./ab-attr";

export class PostWeatherLapseAbAttr extends AbAttr {
  protected readonly weatherTypes: WeatherType[];

  constructor(...weatherTypes: WeatherType[]) {
    super();

    this.weatherTypes = weatherTypes;
  }

  /**
   * Applies an effect after the weather on the field lapses.
   * @param _pokemon The {@linkcode Pokemon} with this ability
   * @param _simulated If `true`, suppresses changes to game state
   * @param _weather The {@linkcode Weather} on the field
   * @param _args
   * @returns
   */
  override apply(_pokemon: Pokemon, _simulated: boolean, _weather: Weather | null, ..._args: unknown[]): boolean {
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
