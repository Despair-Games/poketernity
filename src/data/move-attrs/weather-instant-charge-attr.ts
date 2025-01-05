import type { WeatherType } from "#enums/weather-type";
import { globalScene } from "#app/global-scene";
import { isNullOrUndefined } from "#app/utils";
import { InstantChargeAttr } from "#app/data/move-attrs/instant-charge-attr";

/**
 * Attribute that allows charge moves to resolve in 1 turn while specific {@linkcode WeatherType | Weather}
 * is active. Should only be used for {@linkcode ChargingMove | ChargingMoves} as a `chargeAttr`.
 * @extends InstantChargeAttr
 */
export class WeatherInstantChargeAttr extends InstantChargeAttr {
  constructor(weatherTypes: WeatherType[]) {
    super((_user, _move) => {
      const currentWeather = globalScene.arena.weather;

      if (isNullOrUndefined(currentWeather?.weatherType)) {
        return false;
      } else {
        return !currentWeather?.isEffectSuppressed() && weatherTypes.includes(currentWeather?.weatherType);
      }
    });
  }
}
