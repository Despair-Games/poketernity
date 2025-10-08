import type { ObjectValues } from "#types/utility-types";

export const WeatherType = {
  NONE: 0,
  /**
   * aka "Harsh Sunlight"
   * @see {@link https://bulbapedia.bulbagarden.net/wiki/Harsh_sunlight Harsh Sunlight - Bulbapedia}
   */
  SUNNY: 1,
  /** @see {@link https://bulbapedia.bulbagarden.net/wiki/Rain Rain - Bulbapedia} */
  RAIN: 2,
  /** @see {@link https://bulbapedia.bulbagarden.net/wiki/Sandstorm_(weather_condition) Sandstorm (Weather Condition) - Bulbapedia} */
  SANDSTORM: 3,
  /** @see {@link https://bulbapedia.bulbagarden.net/wiki/Hail_(weather_condition) Hail (Weather Condition) - Bulbapedia} */
  HAIL: 4,
  /** @see {@link https://bulbapedia.bulbagarden.net/wiki/Snow Snow - Bulbapedia} */
  SNOW: 5,
  /** @see {@link https://bulbapedia.bulbagarden.net/wiki/Fog Fog - Bulbapedia} */
  FOG: 6,
  /** @see {@link https://bulbapedia.bulbagarden.net/wiki/Heavy_rain Heavy Rain - Bulbapedia} */
  HEAVY_RAIN: 7,
  /**
   * aka "Extremely Harsh Sunlight"
   * @see {@link https://bulbapedia.bulbagarden.net/wiki/Extremely_harsh_sunlight Extremely Harsh Sunlight - Bulbapedia}
   */
  HARSH_SUN: 8,
  /** @see {@link https://bulbapedia.bulbagarden.net/wiki/Strong_winds Strong Winds - Bulbapedia} */
  STRONG_WINDS: 9,
} as const;

export type WeatherType = ObjectValues<typeof WeatherType>;
