import { Biome } from "#app/data/biome";
import { townPokemonPool, townTrainerPool, townWeatherPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { TerrainType } from "#enums/terrain-type";

/**
 * 25% grassy
 */
const terrainPool: Record<TerrainType, number> = {
  [TerrainType.NONE]: 3,
  [TerrainType.MISTY]: 0,
  [TerrainType.ELECTRIC]: 0,
  [TerrainType.GRASSY]: 1,
  [TerrainType.PSYCHIC]: 0,
};

export const plainsBiome = new Biome(
  BiomeId.PLAINS,
  townPokemonPool,
  townTrainerPool,
  townWeatherPool,
  terrainPool,
  "town",
);
