import { globalScene } from "#app/global-scene";
import { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariableAccuracyAttr } from "#moves/variable-accuracy-attr";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute used for Bleakwind Storm, Wildbolt Storm, and Sandsear Storm
 * that sets accuracy to never miss in rain.
 *
 * Springtide Storm does NOT have this property
 */
export class StormAccuracyAttr extends VariableAccuracyAttr {
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, accuracy: NumberHolder): boolean {
    if (
      !globalScene.arena.weather?.isEffectSuppressed()
      && globalScene.arena.hasWeather([WeatherType.RAIN, WeatherType.HEAVY_RAIN])
    ) {
      accuracy.value = -1;
      return true;
    }

    return false;
  }
}
