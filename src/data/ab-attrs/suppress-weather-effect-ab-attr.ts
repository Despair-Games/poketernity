import type { Weather } from "#app/data/weather";
import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { PreWeatherEffectAbAttr } from "./pre-weather-effect-ab-attr";

export class SuppressWeatherEffectAbAttr extends PreWeatherEffectAbAttr {
  public readonly affectsImmutable: boolean;

  constructor(affectsImmutable: boolean = false) {
    super();

    this.affectsImmutable = affectsImmutable;
  }

  override applyPreWeatherEffect(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    weather: Weather,
    cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    if (this.affectsImmutable || weather.isImmutable()) {
      cancelled.value = true;
      return true;
    }

    return false;
  }
}
