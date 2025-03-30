import { Biome } from "#app/data/biome";
import { townPokemonPool, townTrainerPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { TerrainType } from "#enums/terrain-type";
import { WeatherType } from "#enums/weather-type";

/**
 * 1/4 of Fog
 */
const weatherPool = {
  [WeatherType.NONE]: 3,
  [WeatherType.SUNNY]: 0,
  [WeatherType.RAIN]: 0,
  [WeatherType.SANDSTORM]: 0,
  [WeatherType.HAIL]: 0,
  [WeatherType.SNOW]: 0,
  [WeatherType.FOG]: 1,
  [WeatherType.HEAVY_RAIN]: 0,
  [WeatherType.HARSH_SUN]: 0,
  [WeatherType.STRONG_WINDS]: 0,
};

/**
 * 25% of mist
 */
const terrainPool: Record<TerrainType, number> = {
  [TerrainType.NONE]: 3,
  [TerrainType.MISTY]: 1,
  [TerrainType.ELECTRIC]: 0,
  [TerrainType.GRASSY]: 0,
  [TerrainType.PSYCHIC]: 0,
};

export const graveyardBiome = new Biome(
  BiomeId.GRAVEYARD,
  townPokemonPool,
  townTrainerPool,
  weatherPool,
  terrainPool,
  "town",
);
