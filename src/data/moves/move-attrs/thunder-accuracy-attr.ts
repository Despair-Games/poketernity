import { globalScene } from "#app/global-scene";
import { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariableAccuracyAttr } from "#moves/variable-accuracy-attr";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute used for Thunder and Hurricane that sets accuracy to 50 in sun and never miss in rain
 * @extends VariableAccuracyAttr
 */
export class ThunderAccuracyAttr extends VariableAccuracyAttr {
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
