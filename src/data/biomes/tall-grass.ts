import { Biome } from "#app/data/biome";
import { townPokemonPool, townTrainerPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { TerrainType } from "#enums/terrain-type";
import { WeatherType } from "#enums/weather-type";

/**
 * 8/21 for Sun, 8/21 for Rain, 5/21 for None during dawn/day
 * 5/13 for Rain 8/13 for none otherwise
 */
const weatherPool = {
  [WeatherType.NONE]: 8,
  [WeatherType.SUNNY]: 0,
  [WeatherType.RAIN]: 5,
  [WeatherType.SANDSTORM]: 0,
  [WeatherType.HAIL]: 0,
  [WeatherType.SNOW]: 0,
  [WeatherType.FOG]: 0,
  [WeatherType.HEAVY_RAIN]: 0,
  [WeatherType.HARSH_SUN]: 0,
  [WeatherType.STRONG_WINDS]: 0,
};

/**
 * 100% grassy
 */
const terrainPool: Record<TerrainType, number> = {
  [TerrainType.NONE]: 0,
  [TerrainType.MISTY]: 0,
  [TerrainType.ELECTRIC]: 0,
  [TerrainType.GRASSY]: 1,
  [TerrainType.PSYCHIC]: 0,
};

export const tallGrassBiome = new Biome(
  BiomeId.TALL_GRASS,
  townPokemonPool,
  townTrainerPool,
  weatherPool,
  terrainPool,
  "town",
  8,
);
