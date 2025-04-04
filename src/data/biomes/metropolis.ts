import { Biome } from "#app/data/biome";
import { townTerrainPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { BiomePoolTier } from "#enums/biome-pool-tier";
import { SpeciesId } from "#enums/species-id";
import { TimeOfDay } from "#enums/time-of-day";
import { TrainerType } from "#enums/trainer-type";
import { WeatherType } from "#enums/weather-type";

const pokemonPool = {
  [BiomePoolTier.COMMON]: {
    [TimeOfDay.DAWN]: [SpeciesId.YAMPER],
    [TimeOfDay.DAY]: [SpeciesId.YAMPER],
    [TimeOfDay.DUSK]: [SpeciesId.PATRAT],
    [TimeOfDay.NIGHT]: [SpeciesId.HOUNDOUR, SpeciesId.PATRAT],
    [TimeOfDay.ALL]: [SpeciesId.RATTATA, SpeciesId.ZIGZAGOON, SpeciesId.LILLIPUP],
  },
  [BiomePoolTier.UNCOMMON]: {
    [TimeOfDay.DAWN]: [SpeciesId.PATRAT, SpeciesId.INDEEDEE],
    [TimeOfDay.DAY]: [SpeciesId.PATRAT, SpeciesId.INDEEDEE],
    [TimeOfDay.DUSK]: [SpeciesId.ESPURR],
    [TimeOfDay.NIGHT]: [SpeciesId.ESPURR],
    [TimeOfDay.ALL]: [SpeciesId.PICHU, SpeciesId.GLAMEOW, SpeciesId.FURFROU, SpeciesId.FIDOUGH, SpeciesId.SQUAWKABILLY],
  },
  [BiomePoolTier.RARE]: {
    [TimeOfDay.DAWN]: [SpeciesId.TANDEMAUS],
    [TimeOfDay.DAY]: [SpeciesId.TANDEMAUS],
    [TimeOfDay.DUSK]: [SpeciesId.MORPEKO],
    [TimeOfDay.NIGHT]: [SpeciesId.MORPEKO],
    [TimeOfDay.ALL]: [SpeciesId.VAROOM],
  },
  [BiomePoolTier.SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.DITTO, SpeciesId.EEVEE, SpeciesId.SMEARGLE],
  },
  [BiomePoolTier.ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.CASTFORM],
  },
  [BiomePoolTier.BOSS]: {
    [TimeOfDay.DAWN]: [SpeciesId.BOLTUND],
    [TimeOfDay.DAY]: [SpeciesId.BOLTUND],
    [TimeOfDay.DUSK]: [SpeciesId.MEOWSTIC],
    [TimeOfDay.NIGHT]: [SpeciesId.MEOWSTIC],
    [TimeOfDay.ALL]: [SpeciesId.STOUTLAND, SpeciesId.FURFROU, SpeciesId.DACHSBUN],
  },
  [BiomePoolTier.BOSS_RARE]: {
    [TimeOfDay.DAWN]: [SpeciesId.MAUSHOLD],
    [TimeOfDay.DAY]: [SpeciesId.MAUSHOLD],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.CASTFORM, SpeciesId.REVAVROOM],
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

const trainerPool = {
  [BiomePoolTier.COMMON]: [TrainerType.CLERK, TrainerType.CYCLIST, TrainerType.OFFICER, TrainerType.WAITER],
  [BiomePoolTier.UNCOMMON]: [TrainerType.BREEDER, TrainerType.DEPOT_AGENT, TrainerType.GUITARIST],
  [BiomePoolTier.RARE]: [TrainerType.ARTIST],
  [BiomePoolTier.SUPER_RARE]: [],
  [BiomePoolTier.ULTRA_RARE]: [],
  [BiomePoolTier.BOSS]: [TrainerType.WHITNEY, TrainerType.NORMAN, TrainerType.IONO, TrainerType.LARRY],
  [BiomePoolTier.BOSS_RARE]: [],
  [BiomePoolTier.BOSS_SUPER_RARE]: [],
  [BiomePoolTier.BOSS_ULTRA_RARE]: [],
};

const weatherPool = {
  [WeatherType.NONE]: 1,
};

export const metropolisBiome = new Biome(
  BiomeId.METROPOLIS,
  pokemonPool,
  trainerPool,
  2,
  weatherPool,
  townTerrainPool,
  "town",
);
