import { Biome } from "#app/data/biome";
import { townPokemonPool, townTrainerPool, townTerrainPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { WeatherType } from "#enums/weather-type";

/**
 * Even split of sandstorm/sun during dawn/day
 * 100% of sandstorm otherwise
 */
const weatherPool = {
  [WeatherType.NONE]: 0,
  [WeatherType.SUNNY]: 1,
  [WeatherType.RAIN]: 0,
  [WeatherType.SANDSTORM]: 1,
  [WeatherType.HAIL]: 0,
  [WeatherType.SNOW]: 0,
  [WeatherType.FOG]: 0,
  [WeatherType.HEAVY_RAIN]: 0,
  [WeatherType.HARSH_SUN]: 0,
  [WeatherType.STRONG_WINDS]: 0,
};
export const desertBiome = new Biome(
  BiomeId.DESERT,
  townPokemonPool,
  townTrainerPool,
  weatherPool,
  townTerrainPool,
  "town",
);
