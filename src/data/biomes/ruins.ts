import { Biome } from "#app/data/biome";
import { townPokemonPool, townTrainerPool, townWeatherPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { TerrainType } from "#enums/terrain-type";

/**
 * 100% psychic
 */
const terrainPool: Record<TerrainType, number> = {
  [TerrainType.NONE]: 0,
  [TerrainType.MISTY]: 0,
  [TerrainType.ELECTRIC]: 0,
  [TerrainType.GRASSY]: 0,
  [TerrainType.PSYCHIC]: 1,
};

export const ruinsBiome = new Biome(
  BiomeId.RUINS,
  townPokemonPool,
  townTrainerPool,
  townWeatherPool,
  terrainPool,
  "town",
);
