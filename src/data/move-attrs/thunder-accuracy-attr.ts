import { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableAccuracyAttr } from "#app/data/move-attrs/variable-accuracy-attr";

/**
 * Attribute used for Thunder and Hurricane that sets accuracy to 50 in sun and never miss in rain
 * @extends VariableAccuracyAttr
 */
export class ThunderAccuracyAttr extends VariableAccuracyAttr {
  /**
   * Changes the given move's accuracy according to the active weather:
   * - If the active weather is Sun or Harsh Sun, reduce accuracy to 50
   * - If the active weather is Rain or Heavy Rain, change accuracy to guarantee a hit
   */
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, accuracy: NumberHolder): boolean {
    if (!globalScene.arena.weather?.isEffectSuppressed()) {
      const weatherType = globalScene.arena.weather?.weatherType || WeatherType.NONE;
      switch (weatherType) {
        case WeatherType.SUNNY:
        case WeatherType.HARSH_SUN:
          accuracy.value = 50;
          return true;
        case WeatherType.RAIN:
        case WeatherType.HEAVY_RAIN:
          accuracy.value = -1;
          return true;
      }
    }

    return false;
  }
}
