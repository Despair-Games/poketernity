import type { WeatherType } from "#enums/weather-type";
import type { AtLeastOneArray } from "#types/utility-types";

export interface WeatherBattlerTag {
  weatherTypes: Readonly<AtLeastOneArray<WeatherType>>;
}
