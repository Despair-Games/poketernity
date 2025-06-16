import { globalScene } from "#app/global-scene";
import { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariableAccuracyAttr } from "#moves/variable-accuracy-attr";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute to guarantee the move hits if Hail or Snow is on the field.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Blizzard_(move) | Blizzard}.
 */
export class BlizzardAccuracyAttr extends VariableAccuracyAttr {
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, accuracy: NumberHolder): boolean {
    if (
      !globalScene.arena.weather?.isEffectSuppressed()
      && globalScene.arena.hasWeather([WeatherType.HAIL, WeatherType.SNOW])
    ) {
      accuracy.value = -1;
      return true;
    }
    return false;
  }
}
