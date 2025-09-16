import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";
import type { AbAttrCondition } from "#types/ability-types";
import { getWeatherCondition } from "#utils/ability-utils";

export abstract class PostWeatherLapseAbAttr extends AbAttr {
  protected readonly weatherTypes: WeatherType[];

  constructor(...weatherTypes: WeatherType[]) {
    super();
    this._flags.add(AbAttrFlag.POST_WEATHER_LAPSE);

    this.weatherTypes = weatherTypes;
  }

  /**
   * Applies an effect after the weather on the field lapses.
   * @param pokemon - The {@linkcode Pokemon} with this ability
   * @param simulated - If `true`, suppresses changes to game state
   * @returns `true` if effects successfully apply
   */
  public override apply(_pokemon: Pokemon, _simulated: boolean): boolean {
    return false;
  }

  public override getCondition(): AbAttrCondition {
    return getWeatherCondition(...this.weatherTypes);
  }
}
