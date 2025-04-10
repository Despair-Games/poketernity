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
    [TimeOfDay.DAWN]: [SpeciesId.SLOWPOKE, SpeciesId.WINGULL, SpeciesId.CRAMORANT, SpeciesId.FINIZEN],
    [TimeOfDay.DAY]: [SpeciesId.SLOWPOKE, SpeciesId.WINGULL, SpeciesId.CRAMORANT, SpeciesId.FINIZEN],
    [TimeOfDay.DUSK]: [SpeciesId.INKAY],
    [TimeOfDay.NIGHT]: [SpeciesId.FINNEON, SpeciesId.INKAY],
    [TimeOfDay.ALL]: [SpeciesId.TENTACOOL, SpeciesId.MAGIKARP, SpeciesId.BUIZEL],
  },
  [BiomePoolTier.UNCOMMON]: {
    [TimeOfDay.DAWN]: [SpeciesId.STARYU],
    [TimeOfDay.DAY]: [SpeciesId.STARYU],
    [TimeOfDay.DUSK]: [SpeciesId.SLOWPOKE, SpeciesId.SHELLDER, SpeciesId.CARVANHA],
    [TimeOfDay.NIGHT]: [SpeciesId.SLOWPOKE, SpeciesId.SHELLDER, SpeciesId.CHINCHOU, SpeciesId.CARVANHA],
    [TimeOfDay.ALL]: [
      SpeciesId.POLIWAG,
      SpeciesId.HORSEA,
      SpeciesId.GOLDEEN,
      SpeciesId.WAILMER,
      SpeciesId.PANPOUR,
      SpeciesId.WATTREL,
    ],
  },
  [BiomePoolTier.RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.LAPRAS, SpeciesId.PIPLUP, SpeciesId.POPPLIO],
  },
  [BiomePoolTier.SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.KINGDRA, SpeciesId.ROTOM, SpeciesId.TIRTOUGA],
  },
  [BiomePoolTier.ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [],
  },
  [BiomePoolTier.BOSS]: {
    [TimeOfDay.DAWN]: [SpeciesId.PELIPPER, SpeciesId.CRAMORANT, SpeciesId.PALAFIN],
    [TimeOfDay.DAY]: [SpeciesId.PELIPPER, SpeciesId.CRAMORANT, SpeciesId.PALAFIN],
    [TimeOfDay.DUSK]: [SpeciesId.SHARPEDO, SpeciesId.MALAMAR],
    [TimeOfDay.NIGHT]: [SpeciesId.SHARPEDO, SpeciesId.LUMINEON, SpeciesId.MALAMAR],
    [TimeOfDay.ALL]: [SpeciesId.TENTACRUEL, SpeciesId.FLOATZEL, SpeciesId.SIMIPOUR, SpeciesId.KILOWATTREL],
  },
  [BiomePoolTier.BOSS_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.KINGDRA, SpeciesId.EMPOLEON, SpeciesId.PRIMARINA],
  },
  [BiomePoolTier.BOSS_SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.ROTOM],
  },
  [BiomePoolTier.BOSS_ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.LUGIA],
  },
};

const trainerPool = {
  [BiomePoolTier.COMMON]: [TrainerType.SWIMMER, TrainerType.SAILOR],
  [BiomePoolTier.UNCOMMON]: [],
  [BiomePoolTier.RARE]: [],
  [BiomePoolTier.SUPER_RARE]: [],
  [BiomePoolTier.ULTRA_RARE]: [],
  [BiomePoolTier.BOSS]: [TrainerType.MARLON],
  [BiomePoolTier.BOSS_RARE]: [],
  [BiomePoolTier.BOSS_SUPER_RARE]: [],
  [BiomePoolTier.BOSS_ULTRA_RARE]: [],
};

/**
 * 4/5 of rain
 */
const weatherPool = {
  [WeatherType.NONE]: 1,
  [WeatherType.RAIN]: 4,
};

const terrainPool: Partial<Record<TerrainType, number>> = {
  [TerrainType.NONE]: 1,
};

export const seaBiome = new Biome(BiomeId.SEA, pokemonPool, trainerPool, 8, weatherPool, terrainPool, "sea", 0.024);
