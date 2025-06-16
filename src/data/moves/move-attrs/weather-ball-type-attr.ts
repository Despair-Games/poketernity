import { globalScene } from "#app/global-scene";
import { ElementalType } from "#enums/elemental-type";
import { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariableMoveTypeAttr } from "#moves/variable-move-type-attr";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute to change a move's type to match the active weather.
 * Used by {@link https://bulbapedia.bulbagarden.net/wiki/Weather_Ball_(move) | Weather Ball}.
 */
export class WeatherBallTypeAttr extends VariableMoveTypeAttr {
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, moveType: NumberHolder): boolean {
    if (!globalScene.arena.weather?.isEffectSuppressed()) {
      switch (globalScene.arena.weather?.weatherType) {
        case WeatherType.SUNNY:
        case WeatherType.HARSH_SUN:
          moveType.value = ElementalType.FIRE;
          break;
        case WeatherType.RAIN:
        case WeatherType.HEAVY_RAIN:
          moveType.value = ElementalType.WATER;
          break;
        case WeatherType.SANDSTORM:
          moveType.value = ElementalType.ROCK;
          break;
        case WeatherType.HAIL:
        case WeatherType.SNOW:
          moveType.value = ElementalType.ICE;
          break;
        default:
          return false;
      }
      return true;
    }

    return false;
  }
}
