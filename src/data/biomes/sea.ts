import { Biome } from "#app/data/biome";
import { townTrainerPool, townTerrainPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { BiomePoolTier } from "#enums/biome-pool-tier";
import { SpeciesId } from "#enums/species-id";
import { TimeOfDay } from "#enums/time-of-day";
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

/**
 * 4/5 of rain
 */
const weatherPool = {
  [WeatherType.NONE]: 1,
  [WeatherType.SUNNY]: 0,
  [WeatherType.RAIN]: 4,
  [WeatherType.SANDSTORM]: 0,
  [WeatherType.HAIL]: 0,
  [WeatherType.SNOW]: 0,
  [WeatherType.FOG]: 0,
  [WeatherType.HEAVY_RAIN]: 0,
  [WeatherType.HARSH_SUN]: 0,
  [WeatherType.STRONG_WINDS]: 0,
};

export const seaBiome = new Biome(BiomeId.SEA, pokemonPool, townTrainerPool, weatherPool, townTerrainPool, "town");
