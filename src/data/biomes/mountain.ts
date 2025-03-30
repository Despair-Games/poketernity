import { Biome } from "#app/data/biome";
import { townPokemonPool, townTrainerPool, townWeatherPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { TerrainType } from "#enums/terrain-type";

/**
 * 10% of misty, 10% of electric
 */
const terrainPool: Record<TerrainType, number> = {
  [TerrainType.NONE]: 8,
  [TerrainType.MISTY]: 1,
  [TerrainType.ELECTRIC]: 1,
  [TerrainType.GRASSY]: 0,
  [TerrainType.PSYCHIC]: 0,
};
export const mountainBiome = new Biome(
  BiomeId.MOUNTAIN,
  townPokemonPool,
  townTrainerPool,
  townWeatherPool,
  terrainPool,
  "town",
);
