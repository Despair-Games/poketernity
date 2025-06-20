// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ChargingMove } from "#moves/move";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

import { globalScene } from "#app/global-scene";
import type { WeatherType } from "#enums/weather-type";
import { InstantChargeAttr } from "#moves/instant-charge-attr";
import { isNil } from "#utils/common-utils";

/**
 * Attribute that allows charge moves to resolve in 1 turn while specific {@linkcode WeatherType | Weather} is active.
 *
 * Should only be used for {@linkcode ChargingMove | charge moves} via `.chargeAttr()`.
 */
export class WeatherInstantChargeAttr extends InstantChargeAttr {
  constructor(weatherTypes: WeatherType[]) {
    super((_user, _move) => {
      const currentWeather = globalScene.arena.weather;

      if (isNil(currentWeather?.weatherType)) {
        return false;
      }
      return !currentWeather?.isEffectSuppressed() && weatherTypes.includes(currentWeather?.weatherType);
    });
  }
}
