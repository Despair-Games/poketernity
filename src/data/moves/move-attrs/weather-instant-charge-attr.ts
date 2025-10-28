/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { ChargingMove } from "#moves/move";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import { globalScene } from "#app/global-scene";
import type { WeatherType } from "#enums/weather-type";
import { InstantChargeAttr } from "#moves/instant-charge-attr";
import type { NonEmptyArray } from "#types/utility-types";

/**
 * Attribute that allows charge moves to resolve in 1 turn while specific {@linkcode WeatherType | Weather} is active.
 *
 * Should only be used for {@linkcode ChargingMove | charge moves} via `.chargeAttr()`.
 */
export class WeatherInstantChargeAttr extends InstantChargeAttr {
  constructor(...weatherTypes: Readonly<NonEmptyArray<WeatherType>>) {
    super((_user, _move) => {
      const currentWeather = globalScene.arena.weather;

      if (currentWeather?.weatherType == null) {
        return false;
      }
      return !currentWeather?.isEffectSuppressed() && weatherTypes.includes(currentWeather?.weatherType);
    });
  }
}
