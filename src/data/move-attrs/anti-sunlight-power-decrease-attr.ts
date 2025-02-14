import { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

/**
 * Attribute to halve move power if Rain, Hail, Snow, or a Sandstorm is active.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Solar_Beam_(move) | Solar Beam}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Solar_Blade_(move) | Solar Blade}.
 * @extends VariablePowerAttr
 */
export class AntiSunlightPowerDecreaseAttr extends VariablePowerAttr {
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, power: NumberHolder): boolean {
    if (
      !globalScene.arena.weather?.isEffectSuppressed()
      && globalScene.arena.hasWeather([
        WeatherType.RAIN,
        WeatherType.SANDSTORM,
        WeatherType.HAIL,
        WeatherType.SNOW,
        WeatherType.HEAVY_RAIN,
      ])
    ) {
      power.value *= 0.5;
      return true;
    }

    return false;
  }
}
