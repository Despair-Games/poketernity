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
    [TimeOfDay.DAWN]: [SpeciesId.STARYU],
    [TimeOfDay.DAY]: [SpeciesId.STARYU],
    [TimeOfDay.DUSK]: [SpeciesId.SHELLDER],
    [TimeOfDay.NIGHT]: [SpeciesId.SHELLDER],
    [TimeOfDay.ALL]: [
      SpeciesId.KRABBY,
      SpeciesId.CORPHISH,
      SpeciesId.DWEBBLE,
      SpeciesId.BINACLE,
      SpeciesId.MAREANIE,
      SpeciesId.WIGLETT,
    ],
  },
  [BiomePoolTier.UNCOMMON]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.BURMY, SpeciesId.CLAUNCHER, SpeciesId.SANDYGAST],
  },
  [BiomePoolTier.RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.QUAXLY, SpeciesId.TATSUGIRI],
  },
  [BiomePoolTier.SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.TIRTOUGA],
  },
  [BiomePoolTier.ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.CRESSELIA, SpeciesId.KELDEO, SpeciesId.TAPU_FINI],
  },
  [BiomePoolTier.BOSS]: {
    [TimeOfDay.DAWN]: [SpeciesId.STARMIE],
    [TimeOfDay.DAY]: [SpeciesId.STARMIE],
    [TimeOfDay.DUSK]: [SpeciesId.CLOYSTER],
    [TimeOfDay.NIGHT]: [SpeciesId.CLOYSTER],
    [TimeOfDay.ALL]: [
      SpeciesId.KINGLER,
      SpeciesId.CRAWDAUNT,
      SpeciesId.WORMADAM,
      SpeciesId.CRUSTLE,
      SpeciesId.BARBARACLE,
      SpeciesId.CLAWITZER,
      SpeciesId.TOXAPEX,
      SpeciesId.PALOSSAND,
    ],
  },
  [BiomePoolTier.BOSS_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.CARRACOSTA, SpeciesId.QUAQUAVAL],
  },
  [BiomePoolTier.BOSS_SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.CRESSELIA, SpeciesId.KELDEO, SpeciesId.TAPU_FINI],
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
  [BiomePoolTier.COMMON]: [TrainerType.FISHERMAN, TrainerType.PARASOL_LADY, TrainerType.SAILOR],
  [BiomePoolTier.UNCOMMON]: [TrainerType.ACE_TRAINER, TrainerType.BREEDER],
  [BiomePoolTier.RARE]: [TrainerType.BLACK_BELT],
  [BiomePoolTier.SUPER_RARE]: [],
  [BiomePoolTier.ULTRA_RARE]: [],
  [BiomePoolTier.BOSS]: [TrainerType.MISTY, TrainerType.KOFU],
  [BiomePoolTier.BOSS_RARE]: [],
  [BiomePoolTier.BOSS_SUPER_RARE]: [],
  [BiomePoolTier.BOSS_ULTRA_RARE]: [],
};

/**
 * 5/16 sunny, 3/16 rain if dawn/day
 * 3/11 rain during dusk/night
 */
const weatherPool = {
  [WeatherType.NONE]: 8,
  [WeatherType.SUNNY]: 5,
  [WeatherType.RAIN]: 3,
};

const terrainPool: Partial<Record<TerrainType, number>> = {
  [TerrainType.NONE]: 1,
};

export const beachBiome = new Biome(BiomeId.BEACH, pokemonPool, trainerPool, 4, weatherPool, terrainPool, "town");
