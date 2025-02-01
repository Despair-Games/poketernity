import { ElementType } from "#enums/element-type";
import { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveTypeAttr } from "#app/data/move-attrs/variable-move-type-attr";

/**
 * Attribute to change a move's type to match the active weather.
 * Used by {@link https://bulbapedia.bulbagarden.net/wiki/Weather_Ball_(move) | Weather Ball}.
 * @extends VariableMoveTypeAttr
 */
export class WeatherBallTypeAttr extends VariableMoveTypeAttr {
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, moveType: NumberHolder): boolean {
    if (!globalScene.arena.weather?.isEffectSuppressed()) {
      switch (globalScene.arena.weather?.weatherType) {
        case WeatherType.SUNNY:
        case WeatherType.HARSH_SUN:
          moveType.value = ElementType.FIRE;
          break;
        case WeatherType.RAIN:
        case WeatherType.HEAVY_RAIN:
          moveType.value = ElementType.WATER;
          break;
        case WeatherType.SANDSTORM:
          moveType.value = ElementType.ROCK;
          break;
        case WeatherType.HAIL:
        case WeatherType.SNOW:
          moveType.value = ElementType.ICE;
          break;
        default:
          return false;
      }
      return true;
    }

    return false;
  }
}
