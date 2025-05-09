import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { NumberHolder } from "#app/utils/common-utils";
import { WeatherType } from "#enums/weather-type";
import { VariableAccuracyAttr } from "#moves/variable-accuracy-attr";

/**
 * Attribute used for Bleakwind Storm, Wildbolt Storm, and Sandsear Storm
 * that sets accuracy to never miss in rain.
 * Springtide Storm does NOT have this property
 * @extends VariableAccuracyAttr
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
