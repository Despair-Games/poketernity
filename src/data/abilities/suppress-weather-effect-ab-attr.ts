import type Pokemon from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import type { Weather } from "../weather";
import { PreWeatherEffectAbAttr } from "./pre-weather-effect-ab-attr";

export class SuppressWeatherEffectAbAttr extends PreWeatherEffectAbAttr {
  public affectsImmutable: boolean;

  constructor(affectsImmutable?: boolean) {
    super();

    this.affectsImmutable = !!affectsImmutable;
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
