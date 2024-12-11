import type { AbAttrCondition } from "#app/@types/AbAttrCondition";
import type Pokemon from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { WeatherType } from "#enums/weather-type";
import type { Weather } from "../weather";
import { AbAttr } from "./ab-attr";

export class PostWeatherLapseAbAttr extends AbAttr {
  protected weatherTypes: WeatherType[];

  constructor(...weatherTypes: WeatherType[]) {
    super();

    this.weatherTypes = weatherTypes;
  }

  applyPostWeatherLapse(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _weather: Weather | null,
    _args: any[],
  ): boolean {
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
