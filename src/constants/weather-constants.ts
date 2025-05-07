import { WeatherType } from "#enums/weather-type";

/**
 * Weather types that are associated with the primal forms of the Generation III cover legendary
 * and cannot be overwritten by weaker weather types.
 * @todo - Move to `constants/weather.ts`
 */
export const PRIMAL_WEATHER_TYPES = Object.freeze([
  WeatherType.HARSH_SUN,
  WeatherType.HEAVY_RAIN,
  WeatherType.STRONG_WINDS,
]);

/** Weather types that are associated with the sunny weather. */
export const SUNNY_WEATHER_TYPES = Object.freeze([WeatherType.SUNNY, WeatherType.HARSH_SUN]);

/** The default duration of a freshly applied weather (in turns). */
export const DEFAULT_NEW_WEATHER_DURATION = 5;
