import { Biome } from "#app/data/biome";
import { townTrainerPool, townWeatherPool, townTerrainPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { BiomePoolTier } from "#enums/biome-pool-tier";
import { SpeciesId } from "#enums/species-id";
import { TimeOfDay } from "#enums/time-of-day";

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

export const metropolisBiome = new Biome(
  BiomeId.METROPOLIS,
  pokemonPool,
  townTrainerPool,
  townWeatherPool,
  townTerrainPool,
  "town",
);
