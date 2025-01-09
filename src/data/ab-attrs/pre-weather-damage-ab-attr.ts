import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import type { Weather } from "../weather";
import { PreWeatherEffectAbAttr } from "./pre-weather-effect-ab-attr";

export class PreWeatherDamageAbAttr extends PreWeatherEffectAbAttr {
  constructor(showAbility: boolean = false) {
    super(showAbility, true);
  }

  /**
   * Applies an effect before the source would take damage from weather
   * (e.g. Hail, Sandstorm).
   * @param _pokemon The {@linkcode Pokemon} with this ability
   * @param _simulated If `true`, suppresses changes to game state
   * @param _weather The {@linkcode Weather} applying damage
   * @param _cancelled A {@linkcode BooleanHolder} which, if `true`,
   * cancels the damage taken from weather.
   * @returns `true` if this ability's effects successfully apply.
   */
  override apply(_pokemon: Pokemon, _simulated: boolean, _weather: Weather, _cancelled: BooleanHolder): boolean {
    return false;
  }
}
