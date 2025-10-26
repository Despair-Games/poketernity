import { WeatherType } from "#enums/weather-type";
import type { NonEmptyArray } from "#types/utility-types";

/**
 * Weather types that are associated with the primal forms of the Generation III cover legendary
 * and cannot be overwritten by weaker weather types.
 */
export const PRIMAL_WEATHER_TYPES = Object.freeze<NonEmptyArray<WeatherType>>([
  WeatherType.HARSH_SUN,
  WeatherType.HEAVY_RAIN,
  WeatherType.STRONG_WINDS,
]);

/** Weather types that are associated with the sunny weather. */
export const SUNNY_WEATHER_TYPES = Object.freeze<NonEmptyArray<WeatherType>>([
  WeatherType.SUNNY,
  WeatherType.HARSH_SUN,
]);

/** Weather types that are associated with rainy weather. */
export const RAINY_WEATHER_TYPES = Object.freeze<NonEmptyArray<WeatherType>>([
  WeatherType.RAIN,
  WeatherType.HEAVY_RAIN,
]);

/** Weather types that are associated with snowy weather. */
export const SNOWY_WEATHER_TYPES = Object.freeze<NonEmptyArray<WeatherType>>([WeatherType.SNOW, WeatherType.HAIL]);

/** Weather types that cause damage to pokemon at end of turn. */
export const DAMAGING_WEATHER_TYPES = Object.freeze<NonEmptyArray<WeatherType>>([
  WeatherType.HAIL,
  WeatherType.SANDSTORM,
]);

/** The default duration of a freshly applied weather (in turns). */
export const DEFAULT_NEW_WEATHER_DURATION = 5;

/** The max HP ratio dealt as damage by Sandstorm and Hail */
export const WEATHER_DAMAGE_RATIO = 1 / 16;
