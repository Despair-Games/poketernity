import { Biome } from "#app/data/biome";
import { BiomeId } from "#enums/biome-id";
import { BiomePoolTier } from "#enums/biome-pool-tier";
import { SpeciesId } from "#enums/species-id";
import { TerrainType } from "#enums/terrain-type";
import { TimeOfDay } from "#enums/time-of-day";
import { TrainerType } from "#enums/trainer-type";
import { WeatherType } from "#enums/weather-type";

const pokemonPool = {
  [BiomePoolTier.COMMON]: {
    [TimeOfDay.DAWN]: [SpeciesId.LOTAD, SpeciesId.DUCKLETT],
    [TimeOfDay.DAY]: [SpeciesId.LOTAD, SpeciesId.DUCKLETT],
    [TimeOfDay.DUSK]: [SpeciesId.AZURILL],
    [TimeOfDay.NIGHT]: [SpeciesId.AZURILL],
    [TimeOfDay.ALL]: [SpeciesId.PSYDUCK, SpeciesId.GOLDEEN, SpeciesId.MAGIKARP, SpeciesId.CHEWTLE],
  },
  [BiomePoolTier.UNCOMMON]: {
    [TimeOfDay.DAWN]: [SpeciesId.DEWPIDER],
    [TimeOfDay.DAY]: [SpeciesId.DEWPIDER],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.SLOWPOKE, SpeciesId.WOOPER, SpeciesId.SURSKIT, SpeciesId.WISHIWASHI, SpeciesId.FLAMIGO],
  },
  [BiomePoolTier.RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.SQUIRTLE, SpeciesId.OSHAWOTT, SpeciesId.FROAKIE, SpeciesId.SOBBLE],
  },
  [BiomePoolTier.SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.VAPOREON, SpeciesId.SLOWKING],
  },
  [BiomePoolTier.ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.SUICUNE, SpeciesId.MESPRIT],
  },
  [BiomePoolTier.BOSS]: {
    [TimeOfDay.DAWN]: [SpeciesId.SWANNA, SpeciesId.ARAQUANID],
    [TimeOfDay.DAY]: [SpeciesId.SWANNA, SpeciesId.ARAQUANID],
    [TimeOfDay.DUSK]: [SpeciesId.AZUMARILL],
    [TimeOfDay.NIGHT]: [SpeciesId.AZUMARILL],
    [TimeOfDay.ALL]: [
      SpeciesId.GOLDUCK,
      SpeciesId.SLOWBRO,
      SpeciesId.SEAKING,
      SpeciesId.GYARADOS,
      SpeciesId.MASQUERAIN,
      SpeciesId.WISHIWASHI,
      SpeciesId.DREDNAW,
    ],
  },
  [BiomePoolTier.BOSS_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.BLASTOISE,
      SpeciesId.VAPOREON,
      SpeciesId.SLOWKING,
      SpeciesId.SAMUROTT,
      SpeciesId.GRENINJA,
      SpeciesId.INTELEON,
    ],
  },
  [BiomePoolTier.BOSS_SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.SUICUNE, SpeciesId.MESPRIT],
  },
  [BiomePoolTier.BOSS_ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [],
  },
};

const trainerPool = {
  [BiomePoolTier.COMMON]: [TrainerType.BREEDER, TrainerType.FISHERMAN],
  [BiomePoolTier.UNCOMMON]: [TrainerType.ACE_TRAINER],
  [BiomePoolTier.RARE]: [TrainerType.BLACK_BELT],
  [BiomePoolTier.SUPER_RARE]: [],
  [BiomePoolTier.ULTRA_RARE]: [],
  [BiomePoolTier.BOSS]: [TrainerType.CRASHER_WAKE],
  [BiomePoolTier.BOSS_RARE]: [],
  [BiomePoolTier.BOSS_SUPER_RARE]: [],
  [BiomePoolTier.BOSS_ULTRA_RARE]: [],
};

/**
 * 5/16 for rain, 1/16 for fog
 */
const weatherPool = {
  [WeatherType.NONE]: 10,
  [WeatherType.RAIN]: 5,
  [WeatherType.FOG]: 1,
};

/**
 * 1/5 for misty
 */
const terrainPool: Partial<Record<TerrainType, number>> = {
  [TerrainType.NONE]: 4,
  [TerrainType.MISTY]: 1,
};

export const lakeBiome = new Biome(BiomeId.LAKE, pokemonPool, trainerPool, 6, weatherPool, terrainPool, "town");
