import { Biome } from "#enums/biome";
import { BiomePoolTier } from "#enums/biome-pool-tier";
import { Species } from "#enums/species";
import { TerrainType } from "#enums/terrain-type";
import { TimeOfDay } from "#enums/time-of-day";
import { TrainerType } from "#enums/trainer-type";
import { WeatherType } from "#enums/weather-type";

/**
 * This file represents all the data of the town biome
 */

export const cavePokemonPool = {
  [BiomePoolTier.COMMON]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [Species.ZUBAT],
    // Instead of a TimeofDay.ALL, should these just be in the other TimeOfDays' lists?
    [TimeOfDay.ALL]: [Species.GEODUDE],
  },
  [BiomePoolTier.UNCOMMON]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [Species.ZUBAT],
    [TimeOfDay.ALL]: [Species.GEODUDE],
  },
  [BiomePoolTier.RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [Species.ZUBAT],
    [TimeOfDay.ALL]: [Species.GEODUDE],
  },
  [BiomePoolTier.SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [Species.ZUBAT],
    [TimeOfDay.ALL]: [Species.GEODUDE],
  },
  [BiomePoolTier.ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [Species.ZUBAT],
    [TimeOfDay.ALL]: [Species.GEODUDE],
  },
  [BiomePoolTier.BOSS]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [Species.ZUBAT],
    [TimeOfDay.ALL]: [Species.GEODUDE],
  },
  [BiomePoolTier.BOSS_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [Species.ZUBAT],
    [TimeOfDay.ALL]: [Species.GEODUDE],
  },
  [BiomePoolTier.BOSS_SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [Species.ZUBAT],
    [TimeOfDay.ALL]: [Species.GEODUDE],
  },
  [BiomePoolTier.BOSS_ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [Species.ZUBAT],
    [TimeOfDay.ALL]: [Species.GEODUDE],
  },
};

export const caveTrainerPool = {
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

export const caveWeatherPool = {
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

export const caveTerrainPool = {
  [TerrainType.NONE]: 99,
  [TerrainType.MISTY]: 1,
  [TerrainType.ELECTRIC]: 0,
  [TerrainType.GRASSY]: 0,
  [TerrainType.PSYCHIC]: 0,
};
