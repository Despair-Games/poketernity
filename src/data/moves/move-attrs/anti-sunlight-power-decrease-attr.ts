import { globalScene } from "#app/global-scene";
import { RAINY_WEATHER_TYPES, SNOWY_WEATHER_TYPES } from "#constants/weather-constants";
import { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariablePowerAttr } from "#moves/variable-power-attr";
import type { ValueHolder } from "#utils/common-utils";

/**
 * Attribute to halve move power if Rain, Hail, Snow, or a Sandstorm is active.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Solar_Beam_(move) | Solar Beam}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Solar_Blade_(move) | Solar Blade}.
 */
export class AntiSunlightPowerDecreaseAttr extends VariablePowerAttr {
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, power: ValueHolder<number>): boolean {
    if (
      !globalScene.arena.weather?.isEffectSuppressed()
      && globalScene.arena.hasWeather(...RAINY_WEATHER_TYPES, ...SNOWY_WEATHER_TYPES, WeatherType.SANDSTORM)
    ) {
      power.value *= 0.5;
      return true;
    }

    return false;
  }
}
