import { Biome } from "#app/data/biome";
import { townTrainerPool, townWeatherPool, townTerrainPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { BiomePoolTier } from "#enums/biome-pool-tier";
import { SpeciesId } from "#enums/species-id";
import { TimeOfDay } from "#enums/time-of-day";

const pokemonPool = {
  [BiomePoolTier.COMMON]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [SpeciesId.PATRAT],
    [TimeOfDay.NIGHT]: [SpeciesId.PATRAT],
    [TimeOfDay.ALL]: [SpeciesId.RATTATA, SpeciesId.GRIMER, SpeciesId.KOFFING, SpeciesId.TRUBBISH],
  },
  [BiomePoolTier.UNCOMMON]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [SpeciesId.STUNKY],
    [TimeOfDay.NIGHT]: [SpeciesId.STUNKY],
    [TimeOfDay.ALL]: [SpeciesId.BURMY],
  },
  [BiomePoolTier.RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [SpeciesId.TOXTRICITY, SpeciesId.GALAR_ZIGZAGOON],
    [TimeOfDay.NIGHT]: [SpeciesId.TOXTRICITY, SpeciesId.GALAR_ZIGZAGOON],
    [TimeOfDay.ALL]: [SpeciesId.VAROOM],
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
    [TimeOfDay.ALL]: [SpeciesId.GUZZLORD],
  },
  [BiomePoolTier.BOSS]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [SpeciesId.SKUNTANK, SpeciesId.WATCHOG],
    [TimeOfDay.NIGHT]: [SpeciesId.SKUNTANK, SpeciesId.WATCHOG],
    [TimeOfDay.ALL]: [SpeciesId.MUK, SpeciesId.WEEZING, SpeciesId.WORMADAM, SpeciesId.GARBODOR],
  },
  [BiomePoolTier.BOSS_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [SpeciesId.TOXTRICITY, SpeciesId.OBSTAGOON],
    [TimeOfDay.NIGHT]: [SpeciesId.TOXTRICITY, SpeciesId.OBSTAGOON],
    [TimeOfDay.ALL]: [SpeciesId.REVAVROOM, SpeciesId.GALAR_WEEZING],
  },
  [BiomePoolTier.BOSS_SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.GUZZLORD],
  },
  [BiomePoolTier.BOSS_ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [],
  },
};

export const slumBiome = new Biome(
  BiomeId.SLUM,
  pokemonPool,
  townTrainerPool,
  townWeatherPool,
  townTerrainPool,
  "town",
);
