import { PreWeatherEffectAbAttr } from "#abilities/pre-weather-effect-ab-attr";
import type { Weather } from "#data/weather";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

export class SuppressWeatherEffectAbAttr extends PreWeatherEffectAbAttr {
  /**
   * @todo Should this be removed?
   * Every instance of this attr sets this to `true`.
   */
  public readonly affectsPrimal: boolean;

  constructor(affectsPrimal: boolean = false) {
    super();
    this._flags.add(AbAttrFlag.SUPPRESS_WEATHER_EFFECT);

    this.affectsPrimal = affectsPrimal;
  }

  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _weather: Weather,
    cancelled: ValueHolder<boolean>,
  ): void {
    cancelled.value = true;
  }

  public override canApply(...[, , weather]: Parameters<this["apply"]>): boolean {
    return this.affectsPrimal || !weather.isPrimal();
  }
}
