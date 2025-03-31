import { Biome } from "#app/data/biome";
import { townTrainerPool, townWeatherPool, townTerrainPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { BiomePoolTier } from "#enums/biome-pool-tier";
import { SpeciesId } from "#enums/species-id";
import { TimeOfDay } from "#enums/time-of-day";

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

export const beachBiome = new Biome(
  BiomeId.BEACH,
  pokemonPool,
  townTrainerPool,
  townWeatherPool,
  townTerrainPool,
  "town",
);
