import type { Pokemon } from "#app/field/pokemon";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { WeatherType } from "#enums/weather-type";
import { AbAttr } from "./ab-attr";

export abstract class PostWeatherChangeAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.POST_WEATHER_CHANGE);
  }

  /**
   * Applies an effect after the weather on the field changes
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param weather The {@linkcode Weather} being set on the field
   * @returns `true` if the ability's effect applies successfully
   */
  override apply(_pokemon: Pokemon, _simulated: boolean, _weather: WeatherType): boolean {
    return false;
  }
}
