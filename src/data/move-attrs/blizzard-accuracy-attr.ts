import { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableAccuracyAttr } from "#app/data/move-attrs/variable-accuracy-attr";

/**
 * Attribute to guarantee the move hits if Hail or Snow is on the field.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Blizzard_(move) Blizzard}.
 * @extends VariableAccuracyAttr
 */
export class BlizzardAccuracyAttr extends VariableAccuracyAttr {
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, accuracy: NumberHolder): boolean {
    if (!globalScene.arena.weather?.isEffectSuppressed()) {
      const weatherType = globalScene.arena.weather?.weatherType || WeatherType.NONE;
      if (weatherType === WeatherType.HAIL || weatherType === WeatherType.SNOW) {
        accuracy.value = -1;
        return true;
      }
    }
    return false;
  }
}
