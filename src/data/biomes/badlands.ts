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
    [TimeOfDay.DAWN]: [SpeciesId.PHANPY],
    [TimeOfDay.DAY]: [SpeciesId.PHANPY],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [SpeciesId.CUBONE],
    [TimeOfDay.ALL]: [SpeciesId.DIGLETT, SpeciesId.GEODUDE, SpeciesId.RHYHORN, SpeciesId.DRILBUR, SpeciesId.MUDBRAY],
  },
  [BiomePoolTier.UNCOMMON]: {
    [TimeOfDay.DAWN]: [SpeciesId.SIZZLIPEDE, SpeciesId.CAPSAKID],
    [TimeOfDay.DAY]: [SpeciesId.SIZZLIPEDE, SpeciesId.CAPSAKID],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.SANDSHREW, SpeciesId.NUMEL, SpeciesId.ROGGENROLA, SpeciesId.CUFANT],
  },
  [BiomePoolTier.RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.ONIX, SpeciesId.GLIGAR, SpeciesId.POLTCHAGEIST],
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
    [TimeOfDay.ALL]: [SpeciesId.LANDORUS, SpeciesId.OKIDOGI],
  },
  [BiomePoolTier.BOSS]: {
    [TimeOfDay.DAWN]: [SpeciesId.DONPHAN, SpeciesId.CENTISKORCH, SpeciesId.SCOVILLAIN],
    [TimeOfDay.DAY]: [SpeciesId.DONPHAN, SpeciesId.CENTISKORCH, SpeciesId.SCOVILLAIN],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [SpeciesId.MAROWAK],
    [TimeOfDay.ALL]: [
      SpeciesId.DUGTRIO,
      SpeciesId.GOLEM,
      SpeciesId.RHYPERIOR,
      SpeciesId.GLISCOR,
      SpeciesId.EXCADRILL,
      SpeciesId.MUDSDALE,
      SpeciesId.COPPERAJAH,
    ],
  },
  [BiomePoolTier.BOSS_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.STEELIX, SpeciesId.SINISTCHA],
  },
  [BiomePoolTier.BOSS_SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.LANDORUS, SpeciesId.OKIDOGI],
  },
  [BiomePoolTier.BOSS_ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.GROUDON],
  },
};

const trainerPool = {
  [BiomePoolTier.COMMON]: [TrainerType.BACKPACKER, TrainerType.HIKER],
  [BiomePoolTier.UNCOMMON]: [TrainerType.ACE_TRAINER],
  [BiomePoolTier.RARE]: [],
  [BiomePoolTier.SUPER_RARE]: [],
  [BiomePoolTier.ULTRA_RARE]: [],
  [BiomePoolTier.BOSS]: [TrainerType.CLAY, TrainerType.GRANT],
  [BiomePoolTier.BOSS_RARE]: [],
  [BiomePoolTier.BOSS_SUPER_RARE]: [],
  [BiomePoolTier.BOSS_ULTRA_RARE]: [],
};

/**
 * 2/15 of sandstorm, 5/15 of sun during dawn/day
 * 2/10 of sandstorm during dusk/night
 */
const weatherPool: Partial<Record<WeatherType, number>> = {
  [WeatherType.NONE]: 8,
  [WeatherType.SUNNY]: 5,
  [WeatherType.SANDSTORM]: 2,
};

export const badlandsBiome = new Biome(
  BiomeId.BADLANDS,
  pokemonPool,
  trainerPool,
  8,
  weatherPool,
  townTerrainPool,
  "town",
);
