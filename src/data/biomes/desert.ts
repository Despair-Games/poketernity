import { Biome } from "#app/data/biome";
import { townTrainerPool, townTerrainPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { BiomePoolTier } from "#enums/biome-pool-tier";
import { SpeciesId } from "#enums/species-id";
import { TimeOfDay } from "#enums/time-of-day";
import { WeatherType } from "#enums/weather-type";

const pokemonPool = {
  [BiomePoolTier.COMMON]: {
    [TimeOfDay.DAWN]: [SpeciesId.TRAPINCH, SpeciesId.HIPPOPOTAS, SpeciesId.RELLOR],
    [TimeOfDay.DAY]: [SpeciesId.TRAPINCH, SpeciesId.HIPPOPOTAS, SpeciesId.RELLOR],
    [TimeOfDay.DUSK]: [SpeciesId.CACNEA, SpeciesId.SANDILE],
    [TimeOfDay.NIGHT]: [SpeciesId.CACNEA, SpeciesId.SANDILE],
    [TimeOfDay.ALL]: [SpeciesId.SANDSHREW, SpeciesId.SKORUPI, SpeciesId.SILICOBRA],
  },
  [BiomePoolTier.UNCOMMON]: {
    [TimeOfDay.DAWN]: [SpeciesId.SANDILE, SpeciesId.HELIOPTILE],
    [TimeOfDay.DAY]: [SpeciesId.SANDILE, SpeciesId.HELIOPTILE],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.MARACTUS, SpeciesId.BRAMBLIN, SpeciesId.ORTHWORM],
  },
  [BiomePoolTier.RARE]: {
    [TimeOfDay.DAWN]: [SpeciesId.TRAPINCH],
    [TimeOfDay.DAY]: [SpeciesId.TRAPINCH],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.DARUMAKA],
  },
  [BiomePoolTier.SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.LILEEP, SpeciesId.ANORITH],
  },
  [BiomePoolTier.ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.REGIROCK, SpeciesId.TAPU_BULU, SpeciesId.PHEROMOSA],
  },
  [BiomePoolTier.BOSS]: {
    [TimeOfDay.DAWN]: [SpeciesId.HIPPOWDON, SpeciesId.HELIOLISK, SpeciesId.RABSCA],
    [TimeOfDay.DAY]: [SpeciesId.HIPPOWDON, SpeciesId.HELIOLISK, SpeciesId.RABSCA],
    [TimeOfDay.DUSK]: [SpeciesId.CACTURNE, SpeciesId.KROOKODILE],
    [TimeOfDay.NIGHT]: [SpeciesId.CACTURNE, SpeciesId.KROOKODILE],
    [TimeOfDay.ALL]: [
      SpeciesId.SANDSLASH,
      SpeciesId.DRAPION,
      SpeciesId.DARMANITAN,
      SpeciesId.MARACTUS,
      SpeciesId.SANDACONDA,
      SpeciesId.BRAMBLEGHAST,
    ],
  },
  [BiomePoolTier.BOSS_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.CRADILY, SpeciesId.ARMALDO],
  },
  [BiomePoolTier.BOSS_SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.REGIROCK, SpeciesId.TAPU_BULU, SpeciesId.PHEROMOSA],
  },
  [BiomePoolTier.BOSS_ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [],
  },
};

/**
 * Even split of sandstorm/sun during dawn/day
 * 100% of sandstorm otherwise
 */
const weatherPool = {
  [WeatherType.NONE]: 0,
  [WeatherType.SUNNY]: 1,
  [WeatherType.RAIN]: 0,
  [WeatherType.SANDSTORM]: 1,
  [WeatherType.HAIL]: 0,
  [WeatherType.SNOW]: 0,
  [WeatherType.FOG]: 0,
  [WeatherType.HEAVY_RAIN]: 0,
  [WeatherType.HARSH_SUN]: 0,
  [WeatherType.STRONG_WINDS]: 0,
};
export const desertBiome = new Biome(
  BiomeId.DESERT,
  pokemonPool,
  townTrainerPool,
  weatherPool,
  townTerrainPool,
  "town",
);
