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
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.DROWZEE,
      SpeciesId.NATU,
      SpeciesId.UNOWN,
      SpeciesId.SPOINK,
      SpeciesId.BALTOY,
      SpeciesId.ELGYEM,
    ],
  },
  [BiomePoolTier.UNCOMMON]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.ABRA, SpeciesId.SIGILYPH, SpeciesId.TINKATINK],
  },
  [BiomePoolTier.RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.MR_MIME, SpeciesId.WOBBUFFET, SpeciesId.GOTHITA, SpeciesId.STONJOURNER],
  },
  [BiomePoolTier.SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [SpeciesId.ESPEON],
    [TimeOfDay.DUSK]: [SpeciesId.GALAR_YAMASK],
    [TimeOfDay.NIGHT]: [SpeciesId.GALAR_YAMASK],
    [TimeOfDay.ALL]: [SpeciesId.ARCHEN],
  },
  [BiomePoolTier.ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.REGISTEEL, SpeciesId.FEZANDIPITI],
  },
  [BiomePoolTier.BOSS]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.ALAKAZAM,
      SpeciesId.HYPNO,
      SpeciesId.XATU,
      SpeciesId.GRUMPIG,
      SpeciesId.CLAYDOL,
      SpeciesId.SIGILYPH,
      SpeciesId.GOTHITELLE,
      SpeciesId.BEHEEYEM,
      SpeciesId.TINKATON,
    ],
  },
  [BiomePoolTier.BOSS_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [SpeciesId.ESPEON],
    [TimeOfDay.DUSK]: [SpeciesId.RUNERIGUS],
    [TimeOfDay.NIGHT]: [SpeciesId.RUNERIGUS],
    [TimeOfDay.ALL]: [SpeciesId.MR_MIME, SpeciesId.WOBBUFFET, SpeciesId.ARCHEOPS],
  },
  [BiomePoolTier.BOSS_SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.REGISTEEL, SpeciesId.FEZANDIPITI],
  },
  [BiomePoolTier.BOSS_ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.KORAIDON],
  },
};

export const ruinsBiome = new Biome(
  BiomeId.RUINS,
  pokemonPool,
  townTrainerPool,
  townWeatherPool,
  townTerrainPool,
  "town",
);
