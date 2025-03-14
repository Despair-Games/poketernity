import { Biome } from "#enums/biome";
import { BiomePoolTier } from "#enums/biome-pool-tier";
import { Species } from "#enums/species";
import { TerrainType } from "#enums/terrain-type";
import { TimeOfDay } from "#enums/time-of-day";
import { TrainerType } from "#enums/trainer-type";
import { WeatherType } from "#enums/weather-type";

/**
 * This file represents all the data of biomeExample1
 */

export const biomeExample1pokemonPool = {
  [BiomePoolTier.COMMON]: {
    [TimeOfDay.DAWN]: [Species.CHIKORITA],
    [TimeOfDay.DAY]: [Species.CYNDAQUIL],
    [TimeOfDay.DUSK]: [Species.TOTODILE],
    [TimeOfDay.NIGHT]: [Species.HOOTHOOT],
    // Instead of a TimeofDay.ALL, should these just be in the other TimeOfDays' lists?
    [TimeOfDay.ALL]: [Species.SENTRET],
  },
  [BiomePoolTier.UNCOMMON]: {
    [TimeOfDay.DAWN]: [Species.CHIKORITA],
    [TimeOfDay.DAY]: [Species.CYNDAQUIL],
    [TimeOfDay.DUSK]: [Species.TOTODILE],
    [TimeOfDay.NIGHT]: [Species.HOOTHOOT],
    [TimeOfDay.ALL]: [Species.SENTRET],
  },
  [BiomePoolTier.RARE]: {
    [TimeOfDay.DAWN]: [Species.CHIKORITA],
    [TimeOfDay.DAY]: [Species.CYNDAQUIL],
    [TimeOfDay.DUSK]: [Species.TOTODILE],
    [TimeOfDay.NIGHT]: [Species.HOOTHOOT],
    [TimeOfDay.ALL]: [Species.SENTRET],
  },
  [BiomePoolTier.SUPER_RARE]: {
    [TimeOfDay.DAWN]: [Species.CHIKORITA],
    [TimeOfDay.DAY]: [Species.CYNDAQUIL],
    [TimeOfDay.DUSK]: [Species.TOTODILE],
    [TimeOfDay.NIGHT]: [Species.HOOTHOOT],
    [TimeOfDay.ALL]: [Species.SENTRET],
  },
  [BiomePoolTier.ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [Species.CHIKORITA],
    [TimeOfDay.DAY]: [Species.CYNDAQUIL],
    [TimeOfDay.DUSK]: [Species.TOTODILE],
    [TimeOfDay.NIGHT]: [Species.HOOTHOOT],
    [TimeOfDay.ALL]: [Species.SENTRET],
  },
  [BiomePoolTier.BOSS]: {
    [TimeOfDay.DAWN]: [Species.CHIKORITA],
    [TimeOfDay.DAY]: [Species.CYNDAQUIL],
    [TimeOfDay.DUSK]: [Species.TOTODILE],
    [TimeOfDay.NIGHT]: [Species.HOOTHOOT],
    [TimeOfDay.ALL]: [Species.SENTRET],
  },
  [BiomePoolTier.BOSS_RARE]: {
    [TimeOfDay.DAWN]: [Species.CHIKORITA],
    [TimeOfDay.DAY]: [Species.CYNDAQUIL],
    [TimeOfDay.DUSK]: [Species.TOTODILE],
    [TimeOfDay.NIGHT]: [Species.HOOTHOOT],
    [TimeOfDay.ALL]: [Species.SENTRET],
  },
  [BiomePoolTier.BOSS_SUPER_RARE]: {
    [TimeOfDay.DAWN]: [Species.CHIKORITA],
    [TimeOfDay.DAY]: [Species.CYNDAQUIL],
    [TimeOfDay.DUSK]: [Species.TOTODILE],
    [TimeOfDay.NIGHT]: [Species.HOOTHOOT],
    [TimeOfDay.ALL]: [Species.SENTRET],
  },
  [BiomePoolTier.BOSS_ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [Species.CHIKORITA],
    [TimeOfDay.DAY]: [Species.CYNDAQUIL],
    [TimeOfDay.DUSK]: [Species.TOTODILE],
    [TimeOfDay.NIGHT]: [Species.HOOTHOOT],
    [TimeOfDay.ALL]: [Species.SENTRET],
  },
};

export const biomeExample1trainerPool = {
  [BiomePoolTier.COMMON]: [TrainerType.YOUNGSTER],
  [BiomePoolTier.UNCOMMON]: [],
  [BiomePoolTier.RARE]: [],
  [BiomePoolTier.SUPER_RARE]: [],
  [BiomePoolTier.ULTRA_RARE]: [],
  [BiomePoolTier.BOSS]: [TrainerType.BROCK],
  [BiomePoolTier.BOSS_RARE]: [],
  [BiomePoolTier.BOSS_SUPER_RARE]: [],
  [BiomePoolTier.BOSS_ULTRA_RARE]: [],
};

export const biomeExample1weatherPool = {
  [WeatherType.NONE]: 1,
  [WeatherType.SUNNY]: 1,
  [WeatherType.RAIN]: 0,
  [WeatherType.SANDSTORM]: 0,
  [WeatherType.HAIL]: 0,
  [WeatherType.SNOW]: 0,
  [WeatherType.FOG]: 0,
  [WeatherType.HEAVY_RAIN]: 0,
  [WeatherType.HARSH_SUN]: 1,
  [WeatherType.STRONG_WINDS]: 0,
};

export const biomeExample1terrainPool = {
  [TerrainType.NONE]: 99,
  [TerrainType.MISTY]: 1,
  [TerrainType.ELECTRIC]: 0,
  [TerrainType.GRASSY]: 0,
  [TerrainType.PSYCHIC]: 0,
};
export const biomeExample1OutgoingLinks = {
  [Biome.TOWN]: 50,
  [Biome.END]: 30,
  [Biome.VOLCANO]: 20,
};
