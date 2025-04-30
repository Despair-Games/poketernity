import { InstantChargeAttr } from "#app/data/moves/move-attrs/instant-charge-attr";
import { globalScene } from "#app/global-scene";
import { isNil } from "#app/utils/common-utils";
import type { WeatherType } from "#enums/weather-type";

/**
 * Attribute that allows charge moves to resolve in 1 turn while specific {@linkcode WeatherType | Weather}
 * is active. Should only be used for {@linkcode ChargingMove | charge moves} via `.chargeAttr()`.
 * @extends InstantChargeAttr
 */
export class WeatherInstantChargeAttr extends InstantChargeAttr {
  constructor(weatherTypes: WeatherType[]) {
    super((_user, _move) => {
      const currentWeather = globalScene.arena.weather;

      if (isNil(currentWeather?.weatherType)) {
        return false;
      } else {
        return !currentWeather?.isEffectSuppressed() && weatherTypes.includes(currentWeather?.weatherType);
      }
    });
  }
}
