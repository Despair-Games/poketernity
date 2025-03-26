import { BiomeId } from "#enums/biome-id";

/**
 * TODO
 * Having a BiomeId | (BiomeId | [BiomeId, number]) [] type is needlessly complex
 *
 * Change this to
 * ```
 * interface BiomeLinks {
 *   [key: number /* BiomeId *\/ ]: number /* Weight *\/;
 * }
 * ```
 */
interface BiomeLinks {
  [key: number]: BiomeId | (BiomeId | [BiomeId, number])[];
}

/**
 * TODO: Should this be kept in this file? Or should these be defined as a variable in PEBiomeId?
 *
 * If the latter, should the const definitions be all in one location here?
 */
export const biomeLinks: BiomeLinks = {
  [BiomeId.TOWN]: BiomeId.PLAINS,
  [BiomeId.PLAINS]: [BiomeId.GRASS, BiomeId.METROPOLIS, BiomeId.LAKE],
  [BiomeId.GRASS]: BiomeId.TALL_GRASS,
  [BiomeId.TALL_GRASS]: [BiomeId.FOREST, BiomeId.CAVE],
  [BiomeId.SLUM]: [BiomeId.CONSTRUCTION_SITE, [BiomeId.SWAMP, 2]],
  [BiomeId.FOREST]: [BiomeId.JUNGLE, BiomeId.MEADOW],
  [BiomeId.SEA]: [BiomeId.SEABED, BiomeId.ICE_CAVE],
  [BiomeId.SWAMP]: [BiomeId.GRAVEYARD, BiomeId.TALL_GRASS],
  [BiomeId.BEACH]: [BiomeId.SEA, [BiomeId.ISLAND, 2]],
  [BiomeId.LAKE]: [BiomeId.BEACH, BiomeId.SWAMP, BiomeId.CONSTRUCTION_SITE],
  [BiomeId.SEABED]: [BiomeId.CAVE, [BiomeId.VOLCANO, 3]],
  [BiomeId.MOUNTAIN]: [BiomeId.VOLCANO, [BiomeId.WASTELAND, 2], [BiomeId.SPACE, 3]],
  [BiomeId.BADLANDS]: [BiomeId.DESERT, BiomeId.MOUNTAIN],
  [BiomeId.CAVE]: [BiomeId.BADLANDS, BiomeId.LAKE, [BiomeId.LABORATORY, 2]],
  [BiomeId.DESERT]: [BiomeId.RUINS, [BiomeId.CONSTRUCTION_SITE, 2]],
  [BiomeId.ICE_CAVE]: BiomeId.SNOWY_FOREST,
  [BiomeId.MEADOW]: [BiomeId.PLAINS, BiomeId.FAIRY_CAVE],
  [BiomeId.POWER_PLANT]: BiomeId.FACTORY,
  [BiomeId.VOLCANO]: [BiomeId.BEACH, [BiomeId.ICE_CAVE, 3]],
  [BiomeId.GRAVEYARD]: BiomeId.ABYSS,
  [BiomeId.DOJO]: [BiomeId.PLAINS, [BiomeId.JUNGLE, 2], [BiomeId.TEMPLE, 2]],
  [BiomeId.FACTORY]: [BiomeId.PLAINS, [BiomeId.LABORATORY, 2]],
  [BiomeId.RUINS]: [BiomeId.MOUNTAIN, [BiomeId.FOREST, 2]],
  [BiomeId.WASTELAND]: BiomeId.BADLANDS,
  [BiomeId.ABYSS]: [BiomeId.CAVE, [BiomeId.SPACE, 2], [BiomeId.WASTELAND, 2]],
  [BiomeId.SPACE]: BiomeId.RUINS,
  [BiomeId.CONSTRUCTION_SITE]: [BiomeId.POWER_PLANT, [BiomeId.DOJO, 2]],
  [BiomeId.JUNGLE]: [BiomeId.TEMPLE],
  [BiomeId.FAIRY_CAVE]: [BiomeId.ICE_CAVE, [BiomeId.SPACE, 2]],
  [BiomeId.TEMPLE]: [BiomeId.DESERT, [BiomeId.SWAMP, 2], [BiomeId.RUINS, 2]],
  [BiomeId.METROPOLIS]: BiomeId.SLUM,
  [BiomeId.SNOWY_FOREST]: [BiomeId.FOREST, [BiomeId.MOUNTAIN, 2], [BiomeId.LAKE, 2]],
  [BiomeId.ISLAND]: BiomeId.SEA,
  [BiomeId.LABORATORY]: BiomeId.CONSTRUCTION_SITE,
};
