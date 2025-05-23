import { AbAttr } from "#abilities/ab-attr";
import { globalScene } from "#app/global-scene";
import type { Weather } from "#data/weather";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";
import type { AbAttrCondition } from "#types/ab-attr-condition";

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
  public override apply(_pokemon: Pokemon, _simulated: boolean, _weather: Weather): boolean {
    return false;
  }

  public override getCondition(): AbAttrCondition {
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
    return globalScene.arena.hasWeather([...weatherTypes]);
  };
}

//#endregion
