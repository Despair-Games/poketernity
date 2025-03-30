import { Biome } from "#app/data/biome";
import { townPokemonPool, townTrainerPool, townWeatherPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { TerrainType } from "#enums/terrain-type";

/**
 * 50% psychic
 */
const terrainPool: Record<TerrainType, number> = {
  [TerrainType.NONE]: 1,
  [TerrainType.MISTY]: 0,
  [TerrainType.ELECTRIC]: 0,
  [TerrainType.GRASSY]: 0,
  [TerrainType.PSYCHIC]: 1,
};

export const templeBiome = new Biome(
  BiomeId.TEMPLE,
  townPokemonPool,
  townTrainerPool,
  townWeatherPool,
  terrainPool,
  "town",
);
