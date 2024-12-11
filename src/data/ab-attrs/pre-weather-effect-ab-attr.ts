import type { Weather } from "#app/data/weather";
import type Pokemon from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

export class PreWeatherEffectAbAttr extends AbAttr {
  applyPreWeatherEffect(
    _pokemon: Pokemon,
    _passive: Boolean,
    _simulated: boolean,
    _weather: Weather | null,
    _cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    return false;
  }
}
