import type { WeatherType } from "#enums/weather-type";
import type { NonEmptyArray } from "#types/utility-types";

export interface WeatherBattlerTag {
  weatherTypes: Readonly<NonEmptyArray<WeatherType>>;
}
