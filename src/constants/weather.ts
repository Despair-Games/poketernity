import { WeatherType } from "#enums/weather-type";

/** Weather types that are associated with the sunny weather. */
export const SUNNY_WEATHER_TYPES = Object.freeze([WeatherType.SUNNY, WeatherType.HARSH_SUN]);

/** The defualt duration of a freshly applied weather (in turns). */
export const DEFAULT_NEW_WEATHER_DURATION = 5;
