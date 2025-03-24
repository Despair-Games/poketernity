import { Biome } from "#enums/biome";

interface BiomeLinks {
    [key: number]: Biome | (Biome | [Biome, number])[];
  }

export const biomeLinks: BiomeLinks = {
    [Biome.TOWN]: Biome.PLAINS,
    [Biome.PLAINS]: [Biome.GRASS, Biome.METROPOLIS, Biome.LAKE],
    [Biome.GRASS]: Biome.TALL_GRASS,
    [Biome.TALL_GRASS]: [Biome.FOREST, Biome.CAVE],
    [Biome.SLUM]: [Biome.CONSTRUCTION_SITE, [Biome.SWAMP, 2]],
    [Biome.FOREST]: [Biome.JUNGLE, Biome.MEADOW],
    [Biome.SEA]: [Biome.SEABED, Biome.ICE_CAVE],
    [Biome.SWAMP]: [Biome.GRAVEYARD, Biome.TALL_GRASS],
    [Biome.BEACH]: [Biome.SEA, [Biome.ISLAND, 2]],
    [Biome.LAKE]: [Biome.BEACH, Biome.SWAMP, Biome.CONSTRUCTION_SITE],
    [Biome.SEABED]: [Biome.CAVE, [Biome.VOLCANO, 3]],
    [Biome.MOUNTAIN]: [Biome.VOLCANO, [Biome.WASTELAND, 2], [Biome.SPACE, 3]],
    [Biome.BADLANDS]: [Biome.DESERT, Biome.MOUNTAIN],
    [Biome.CAVE]: [Biome.BADLANDS, Biome.LAKE, [Biome.LABORATORY, 2]],
    [Biome.DESERT]: [Biome.RUINS, [Biome.CONSTRUCTION_SITE, 2]],
    [Biome.ICE_CAVE]: Biome.SNOWY_FOREST,
    [Biome.MEADOW]: [Biome.PLAINS, Biome.FAIRY_CAVE],
    [Biome.POWER_PLANT]: Biome.FACTORY,
    [Biome.VOLCANO]: [Biome.BEACH, [Biome.ICE_CAVE, 3]],
    [Biome.GRAVEYARD]: Biome.ABYSS,
    [Biome.DOJO]: [Biome.PLAINS, [Biome.JUNGLE, 2], [Biome.TEMPLE, 2]],
    [Biome.FACTORY]: [Biome.PLAINS, [Biome.LABORATORY, 2]],
    [Biome.RUINS]: [Biome.MOUNTAIN, [Biome.FOREST, 2]],
    [Biome.WASTELAND]: Biome.BADLANDS,
    [Biome.ABYSS]: [Biome.CAVE, [Biome.SPACE, 2], [Biome.WASTELAND, 2]],
    [Biome.SPACE]: Biome.RUINS,
    [Biome.CONSTRUCTION_SITE]: [Biome.POWER_PLANT, [Biome.DOJO, 2]],
    [Biome.JUNGLE]: [Biome.TEMPLE],
    [Biome.FAIRY_CAVE]: [Biome.ICE_CAVE, [Biome.SPACE, 2]],
    [Biome.TEMPLE]: [Biome.DESERT, [Biome.SWAMP, 2], [Biome.RUINS, 2]],
    [Biome.METROPOLIS]: Biome.SLUM,
    [Biome.SNOWY_FOREST]: [Biome.FOREST, [Biome.MOUNTAIN, 2], [Biome.LAKE, 2]],
    [Biome.ISLAND]: Biome.SEA,
    [Biome.LABORATORY]: Biome.CONSTRUCTION_SITE,
  };