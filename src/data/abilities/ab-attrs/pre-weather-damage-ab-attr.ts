import { PreWeatherEffectAbAttr } from "#abilities/pre-weather-effect-ab-attr";
import type { Weather } from "#data/weather";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

export abstract class PreWeatherDamageAbAttr extends PreWeatherEffectAbAttr {
  constructor() {
    super();
    this._flags.add(AbAttrFlag.PRE_WEATHER_DAMAGE);
  }

  /**
   * Applies an effect before the source would take damage from weather
   * (e.g. Hail, Sandstorm).
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param weather The {@linkcode Weather} applying damage
   * @param cancelled A {@linkcode BooleanHolder} which, if `true`,
   * cancels the damage taken from weather.
   */
  public abstract override apply(
    pokemon: Pokemon,
    simulated: boolean,
    weather: Weather,
    cancelled: ValueHolder<boolean>,
  ): void;
}
