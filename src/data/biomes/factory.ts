import { Biome } from "#app/data/biome";
import { townPokemonPool, townTrainerPool, townWeatherPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { TerrainType } from "#enums/terrain-type";

/**
 * 50% of electric
 */
const terrainPool: Record<TerrainType, number> = {
  [TerrainType.NONE]: 1,
  [TerrainType.MISTY]: 0,
  [TerrainType.ELECTRIC]: 1,
  [TerrainType.GRASSY]: 0,
  [TerrainType.PSYCHIC]: 0,
};
export const factoryBiome = new Biome(
  BiomeId.FACTORY,
  townPokemonPool,
  townTrainerPool,
  townWeatherPool,
  terrainPool,
  "town",
);
