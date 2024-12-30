import { Type } from "#enums/type";
import { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveTypeAttr } from "#app/data/move-attrs/variable-move-type-attr";

export class WeatherBallTypeAttr extends VariableMoveTypeAttr {
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, moveType: NumberHolder): boolean {
    if (!globalScene.arena.weather?.isEffectSuppressed()) {
      switch (globalScene.arena.weather?.weatherType) {
        case WeatherType.SUNNY:
        case WeatherType.HARSH_SUN:
          moveType.value = Type.FIRE;
          break;
        case WeatherType.RAIN:
        case WeatherType.HEAVY_RAIN:
          moveType.value = Type.WATER;
          break;
        case WeatherType.SANDSTORM:
          moveType.value = Type.ROCK;
          break;
        case WeatherType.HAIL:
        case WeatherType.SNOW:
          moveType.value = Type.ICE;
          break;
        default:
          return false;
      }
      return true;
    }

    return false;
  }
}
