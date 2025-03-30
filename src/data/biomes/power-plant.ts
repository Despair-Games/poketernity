import { Biome } from "#app/data/biome";
import { townPokemonPool, townTrainerPool, townWeatherPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { TerrainType } from "#enums/terrain-type";

/**
 * 100% of electric terrain
 */
const terrainPool: Record<TerrainType, number> = {
  [TerrainType.NONE]: 0,
  [TerrainType.MISTY]: 0,
  [TerrainType.ELECTRIC]: 1,
  [TerrainType.GRASSY]: 0,
  [TerrainType.PSYCHIC]: 0,
};

export const powerPlantBiome = new Biome(
  BiomeId.POWER_PLANT,
  townPokemonPool,
  townTrainerPool,
  townWeatherPool,
  terrainPool,
  "town",
);
