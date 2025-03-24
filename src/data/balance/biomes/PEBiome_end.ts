import { BiomePoolTier } from "#enums/biome-pool-tier";
import { Species } from "#enums/species";
import { TerrainType } from "#enums/terrain-type";
import { TimeOfDay } from "#enums/time-of-day";
import { WeatherType } from "#enums/weather-type";

/**
 * This file represents all the data of the town biome
 */

export const endPokemonPool = {
  [BiomePoolTier.COMMON]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      Species.GREAT_TUSK,
      Species.SCREAM_TAIL,
      Species.BRUTE_BONNET,
      Species.FLUTTER_MANE,
      Species.SLITHER_WING,
      Species.SANDY_SHOCKS,
      Species.IRON_TREADS,
      Species.IRON_BUNDLE,
      Species.IRON_HANDS,
      Species.IRON_JUGULIS,
      Species.IRON_MOTH,
      Species.IRON_THORNS,
    ],
  },
  [BiomePoolTier.UNCOMMON]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [Species.ROARING_MOON, Species.IRON_VALIANT],
  },
  [BiomePoolTier.RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      Species.WALKING_WAKE,
      Species.IRON_LEAVES,
      Species.GOUGING_FIRE,
      Species.RAGING_BOLT,
      Species.IRON_BOULDER,
      Species.IRON_CROWN,
    ],
  },
  [BiomePoolTier.SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [],
  },
  [BiomePoolTier.ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [],
  },
  [BiomePoolTier.BOSS]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [Species.ETERNATUS],
  },
  [BiomePoolTier.BOSS_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [],
  },
  [BiomePoolTier.BOSS_SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [],
  },
  [BiomePoolTier.BOSS_ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [],
  },
};

export const endTrainerPool = {
  [BiomePoolTier.COMMON]: [],
  [BiomePoolTier.UNCOMMON]: [],
  [BiomePoolTier.RARE]: [],
  [BiomePoolTier.SUPER_RARE]: [],
  [BiomePoolTier.ULTRA_RARE]: [],
  [BiomePoolTier.BOSS]: [],
  [BiomePoolTier.BOSS_RARE]: [],
  [BiomePoolTier.BOSS_SUPER_RARE]: [],
  [BiomePoolTier.BOSS_ULTRA_RARE]: [],
};

export const endWeatherPool = {
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

export const endTerrainPool = {
  [TerrainType.NONE]: 99,
  [TerrainType.MISTY]: 1,
  [TerrainType.ELECTRIC]: 0,
  [TerrainType.GRASSY]: 0,
  [TerrainType.PSYCHIC]: 0,
};
