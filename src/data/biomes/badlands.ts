import { Biome } from "#app/data/biome";
import { townPokemonPool, townTrainerPool, townTerrainPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { WeatherType } from "#enums/weather-type";

/**
 * 2/15 of sandstorm, 1/3 of sun, 8/15 of none during dawn/day
 * 20% of sandstorm otherwise
 */
const weatherPool = {
  [WeatherType.NONE]: 8,
  [WeatherType.SUNNY]: 0,
  [WeatherType.RAIN]: 0,
  [WeatherType.SANDSTORM]: 2,
  [WeatherType.HAIL]: 0,
  [WeatherType.SNOW]: 0,
  [WeatherType.FOG]: 0,
  [WeatherType.HEAVY_RAIN]: 0,
  [WeatherType.HARSH_SUN]: 0,
  [WeatherType.STRONG_WINDS]: 0,
};
export const badlandsBiome = new Biome(
  BiomeId.BADLANDS,
  townPokemonPool,
  townTrainerPool,
  weatherPool,
  townTerrainPool,
  "town",
  5,
);
