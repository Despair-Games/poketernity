import { globalScene } from "#app/global-scene";
import { RAINY_WEATHER_TYPES } from "#constants/weather-constants";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariableAccuracyAttr } from "#moves/variable-accuracy-attr";
import type { ValueHolder } from "#utils/common-utils";

/**
 * Attribute used for Bleakwind Storm, Wildbolt Storm, and Sandsear Storm
 * that sets accuracy to never miss in rain.
 *
 * Springtide Storm does NOT have this property
 */
export class StormAccuracyAttr extends VariableAccuracyAttr {
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, accuracy: ValueHolder<number>): boolean {
    if (!globalScene.arena.weather?.isEffectSuppressed() && globalScene.arena.hasWeather(...RAINY_WEATHER_TYPES)) {
      accuracy.value = -1;
      return true;
    }

    return false;
  }
}
