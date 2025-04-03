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
    [TimeOfDay.DAWN]: [SpeciesId.BOUNSWEET],
    [TimeOfDay.DAY]: [SpeciesId.NIDORAN_F, SpeciesId.NIDORAN_M, SpeciesId.BOUNSWEET],
    [TimeOfDay.DUSK]: [SpeciesId.ODDISH, SpeciesId.KRICKETOT],
    [TimeOfDay.NIGHT]: [SpeciesId.ODDISH, SpeciesId.KRICKETOT],
    [TimeOfDay.ALL]: [SpeciesId.NINJASK, SpeciesId.FOMANTIS, SpeciesId.NYMBLE],
  },
  [BiomePoolTier.UNCOMMON]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [SpeciesId.PARAS, SpeciesId.VENONAT, SpeciesId.SPINARAK],
    [TimeOfDay.ALL]: [SpeciesId.VULPIX],
  },
  [BiomePoolTier.RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.PINSIR,
      SpeciesId.CHIKORITA,
      SpeciesId.GIRAFARIG,
      SpeciesId.ZANGOOSE,
      SpeciesId.KECLEON,
      SpeciesId.TROPIUS,
    ],
  },
  [BiomePoolTier.SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.SCYTHER, SpeciesId.SHEDINJA, SpeciesId.ROTOM],
  },
  [BiomePoolTier.ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [],
  },
  [BiomePoolTier.BOSS]: {
    [TimeOfDay.DAWN]: [SpeciesId.TSAREENA],
    [TimeOfDay.DAY]: [SpeciesId.NIDOQUEEN, SpeciesId.NIDOKING, SpeciesId.TSAREENA],
    [TimeOfDay.DUSK]: [SpeciesId.VILEPLUME, SpeciesId.KRICKETUNE],
    [TimeOfDay.NIGHT]: [SpeciesId.VILEPLUME, SpeciesId.KRICKETUNE],
    [TimeOfDay.ALL]: [SpeciesId.NINJASK, SpeciesId.ZANGOOSE, SpeciesId.KECLEON, SpeciesId.LURANTIS, SpeciesId.LOKIX],
  },
  [BiomePoolTier.BOSS_RARE]: {
    [TimeOfDay.DAWN]: [SpeciesId.BELLOSSOM],
    [TimeOfDay.DAY]: [SpeciesId.BELLOSSOM],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.PINSIR, SpeciesId.MEGANIUM, SpeciesId.FARIGIRAF],
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
    [TimeOfDay.ALL]: [],
  },
};

const trainerPool = {
  [BiomePoolTier.COMMON]: [],
  [BiomePoolTier.UNCOMMON]: [TrainerType.ACE_TRAINER, TrainerType.BREEDER, TrainerType.RANGER],
  [BiomePoolTier.RARE]: [],
  [BiomePoolTier.SUPER_RARE]: [],
  [BiomePoolTier.ULTRA_RARE]: [],
  [BiomePoolTier.BOSS]: [TrainerType.GARDENIA, TrainerType.VIOLA, TrainerType.BRASSIUS],
  [BiomePoolTier.BOSS_RARE]: [],
  [BiomePoolTier.BOSS_SUPER_RARE]: [],
  [BiomePoolTier.BOSS_ULTRA_RARE]: [],
};

/**
 * 8/21 for sun, 5/21 for rain during dawn/day
 * 5/13 for rain during dusk/night
 */
const weatherPool = {
  [WeatherType.NONE]: 8,
  [WeatherType.SUNNY]: 8,
  [WeatherType.RAIN]: 5,
};

export const tallGrassBiome = new Biome(
  BiomeId.TALL_GRASS,
  pokemonPool,
  trainerPool,
  8,
  weatherPool,
  townTerrainPool,
  "town",
);
