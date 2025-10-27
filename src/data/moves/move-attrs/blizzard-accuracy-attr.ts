import { globalScene } from "#app/global-scene";
import { SNOWY_WEATHER_TYPES } from "#constants/weather-constants";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariableAccuracyAttr } from "#moves/variable-accuracy-attr";
import type { ValueHolder } from "#utils/common-utils";

/**
 * Attribute to guarantee the move hits if Hail or Snow is on the field.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Blizzard_(move) | Blizzard}.
 */
export class BlizzardAccuracyAttr extends VariableAccuracyAttr {
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, accuracy: ValueHolder<number>): boolean {
    if (!globalScene.arena.weather?.isEffectSuppressed() && globalScene.arena.hasWeather(...SNOWY_WEATHER_TYPES)) {
      accuracy.value = -1;
      return true;
    }
    return false;
  }
}
