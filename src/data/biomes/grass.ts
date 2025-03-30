import { Biome } from "#app/data/biome";
import { townPokemonPool, townTrainerPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { TerrainType } from "#enums/terrain-type";
import { WeatherType } from "#enums/weather-type";

/** 30% of sun if dawn or day, none otherwise */
const weatherPool = {
  [WeatherType.NONE]: 7,
  [WeatherType.SUNNY]: 0,
  [WeatherType.RAIN]: 0,
  [WeatherType.SANDSTORM]: 0,
  [WeatherType.HAIL]: 0,
  [WeatherType.SNOW]: 0,
  [WeatherType.FOG]: 0,
  [WeatherType.HEAVY_RAIN]: 0,
  [WeatherType.HARSH_SUN]: 0,
  [WeatherType.STRONG_WINDS]: 0,
};

/**
 * 50% grassy
 */
const terrainPool: Record<TerrainType, number> = {
  [TerrainType.NONE]: 1,
  [TerrainType.MISTY]: 0,
  [TerrainType.ELECTRIC]: 0,
  [TerrainType.GRASSY]: 1,
  [TerrainType.PSYCHIC]: 0,
};

export const grassBiome = new Biome(
  BiomeId.GRASS,
  townPokemonPool,
  townTrainerPool,
  weatherPool,
  terrainPool,
  "town",
  3,
);
