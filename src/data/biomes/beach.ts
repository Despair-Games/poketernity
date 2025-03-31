import { Biome } from "#app/data/biome";
import { townPokemonPool, townTrainerPool, townTerrainPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { WeatherType } from "#enums/weather-type";

/**
 * 5/16 Sunny, 3/16 Rain if dawn/day
 * 3/11 Rain otherwise
 */
const weatherPool = {
  [WeatherType.NONE]: 8,
  [WeatherType.SUNNY]: 5,
  [WeatherType.RAIN]: 3,
  [WeatherType.SANDSTORM]: 0,
  [WeatherType.HAIL]: 0,
  [WeatherType.SNOW]: 0,
  [WeatherType.FOG]: 0,
  [WeatherType.HEAVY_RAIN]: 0,
  [WeatherType.HARSH_SUN]: 0,
  [WeatherType.STRONG_WINDS]: 0,
};
export const beachBiome = new Biome(
  BiomeId.BEACH,
  townPokemonPool,
  townTrainerPool,
  weatherPool,
  townTerrainPool,
  "town",
);
