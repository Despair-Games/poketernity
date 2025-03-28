import { Biome } from "#app/data/biome";
import { townPokemonPool, townTrainerPool, townTerrainPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { WeatherType } from "#enums/weather-type";

/**
 * 20% of rain
 */
const weatherPool = {
  [WeatherType.NONE]: 4,
  [WeatherType.SUNNY]: 0,
  [WeatherType.RAIN]: 1,
  [WeatherType.SANDSTORM]: 0,
  [WeatherType.HAIL]: 0,
  [WeatherType.SNOW]: 0,
  [WeatherType.FOG]: 0,
  [WeatherType.HEAVY_RAIN]: 0,
  [WeatherType.HARSH_SUN]: 0,
  [WeatherType.STRONG_WINDS]: 0,
};
export const jungleBiome = new Biome(
  BiomeId.JUNGLE,
  townPokemonPool,
  townTrainerPool,
  weatherPool,
  townTerrainPool,
  "town",
);
