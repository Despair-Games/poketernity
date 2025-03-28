import { Biome } from "#app/data/biome";
import { townPokemonPool, townTrainerPool, townTerrainPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { WeatherType } from "#enums/weather-type";

/**
 * 1/8 for rain, 1/4 for sun if dawn/day
 * 1/6 for rain otherwise
 */
const weatherPool = {
  [WeatherType.NONE]: 5,
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
export const islandBiome = new Biome(
  BiomeId.ISLAND,
  townPokemonPool,
  townTrainerPool,
  weatherPool,
  townTerrainPool,
  "town",
  2,
);
