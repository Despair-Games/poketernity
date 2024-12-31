import { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

export class AntiSunlightPowerDecreaseAttr extends VariablePowerAttr {
  /** Halves the given move's power if Rain, Hail, Snow, or a Sandstorm is active */
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, power: NumberHolder): boolean {
    if (!globalScene.arena.weather?.isEffectSuppressed()) {
      const weatherType = globalScene.arena.weather?.weatherType || WeatherType.NONE;
      switch (weatherType) {
        case WeatherType.RAIN:
        case WeatherType.SANDSTORM:
        case WeatherType.HAIL:
        case WeatherType.SNOW:
        case WeatherType.HEAVY_RAIN:
          power.value *= 0.5;
          return true;
      }
    }

    return false;
  }
}
