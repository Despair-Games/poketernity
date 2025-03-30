import { Biome } from "#app/data/biome";
import { townPokemonPool, townTrainerPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { TerrainType } from "#enums/terrain-type";
import { WeatherType } from "#enums/weather-type";

/**
 * 10/16 for None, 5/16 for rain, 1/16 for fog
 */
const weatherPool = {
  [WeatherType.NONE]: 10,
  [WeatherType.SUNNY]: 0,
  [WeatherType.RAIN]: 5,
  [WeatherType.SANDSTORM]: 0,
  [WeatherType.HAIL]: 0,
  [WeatherType.SNOW]: 0,
  [WeatherType.FOG]: 1,
  [WeatherType.HEAVY_RAIN]: 0,
  [WeatherType.HARSH_SUN]: 0,
  [WeatherType.STRONG_WINDS]: 0,
};

/**
 * 20% of mist
 */
const terrainPool: Record<TerrainType, number> = {
  [TerrainType.NONE]: 4,
  [TerrainType.MISTY]: 1,
  [TerrainType.ELECTRIC]: 0,
  [TerrainType.GRASSY]: 0,
  [TerrainType.PSYCHIC]: 0,
};

export const lakeBiome = new Biome(BiomeId.LAKE, townPokemonPool, townTrainerPool, weatherPool, terrainPool, "town");
