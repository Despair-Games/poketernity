import { AbAttr } from "#abilities/ab-attr";
import type { Weather } from "#data/weather";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

export abstract class PreWeatherEffectAbAttr extends AbAttr {
  /**
   * Applies an effect before weather effects would trigger
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param weather The active {@linkcode Weather} on the field
   * @param cancelled A {@linkcode BooleanHolder} which, if `true`,
   * cancel's the current weather's effects.
   * @returns `true` if effects from this attribute apply successfully
   */
  public abstract override apply(
    pokemon: Pokemon,
    simulated: boolean,
    weather: Weather | null,
    cancelled: ValueHolder<boolean>,
  ): void;
}
