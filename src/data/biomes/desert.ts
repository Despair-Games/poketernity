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

const trainerPool = {
  [BiomePoolTier.COMMON]: [TrainerType.SCIENTIST],
  [BiomePoolTier.UNCOMMON]: [],
  [BiomePoolTier.RARE]: [],
  [BiomePoolTier.SUPER_RARE]: [],
  [BiomePoolTier.ULTRA_RARE]: [],
  [BiomePoolTier.BOSS]: [TrainerType.GORDIE],
  [BiomePoolTier.BOSS_RARE]: [],
  [BiomePoolTier.BOSS_SUPER_RARE]: [],
  [BiomePoolTier.BOSS_ULTRA_RARE]: [],
};

/**
 * Even split of sandstorm/sun during dawn/day
 * 100% of sandstorm otherwise
 */
const weatherPool = {
  [WeatherType.NONE]: 0,
  [WeatherType.SUNNY]: 1,
  [WeatherType.SANDSTORM]: 1,
};

const terrainPool: Partial<Record<TerrainType, number>> = {
  [TerrainType.NONE]: 1,
};
export const desertBiome = new Biome(BiomeId.DESERT, pokemonPool, trainerPool, 8, weatherPool, terrainPool, "town");
