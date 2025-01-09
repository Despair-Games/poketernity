import type { Weather } from "#app/data/weather";
import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

export class PreWeatherEffectAbAttr extends AbAttr {
  /**
   * Applies an effect before weather effects would trigger
   * @param _pokemon The {@linkcode Pokemon} with this ability
   * @param _simulated If `true`, suppresses changes to game state
   * @param _weather The active {@linkcode Weather} on the field
   * @param _cancelled A {@linkcode BooleanHolder} which, if `true`,
   * cancel's the current weather's effects.
   * @returns `true` if effects from this attribute apply successfully
   */
  override apply(_pokemon: Pokemon, _simulated: boolean, _weather: Weather | null, _cancelled: BooleanHolder): boolean {
    return false;
  }
}
