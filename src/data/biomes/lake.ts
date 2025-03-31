import { Biome } from "#app/data/biome";
import { townTrainerPool, townWeatherPool, townTerrainPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { BiomePoolTier } from "#enums/biome-pool-tier";
import { SpeciesId } from "#enums/species-id";
import { TimeOfDay } from "#enums/time-of-day";

const pokemonPool = {
  [BiomePoolTier.COMMON]: {
    [TimeOfDay.DAWN]: [SpeciesId.LOTAD, SpeciesId.DUCKLETT],
    [TimeOfDay.DAY]: [SpeciesId.LOTAD, SpeciesId.DUCKLETT],
    [TimeOfDay.DUSK]: [SpeciesId.AZURILL],
    [TimeOfDay.NIGHT]: [SpeciesId.AZURILL],
    [TimeOfDay.ALL]: [SpeciesId.PSYDUCK, SpeciesId.GOLDEEN, SpeciesId.MAGIKARP, SpeciesId.CHEWTLE],
  },
  [BiomePoolTier.UNCOMMON]: {
    [TimeOfDay.DAWN]: [SpeciesId.DEWPIDER],
    [TimeOfDay.DAY]: [SpeciesId.DEWPIDER],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.SLOWPOKE, SpeciesId.WOOPER, SpeciesId.SURSKIT, SpeciesId.WISHIWASHI, SpeciesId.FLAMIGO],
  },
  [BiomePoolTier.RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.SQUIRTLE, SpeciesId.OSHAWOTT, SpeciesId.FROAKIE, SpeciesId.SOBBLE],
  },
  [BiomePoolTier.SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.VAPOREON, SpeciesId.SLOWKING],
  },
  [BiomePoolTier.ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.SUICUNE, SpeciesId.MESPRIT],
  },
  [BiomePoolTier.BOSS]: {
    [TimeOfDay.DAWN]: [SpeciesId.SWANNA, SpeciesId.ARAQUANID],
    [TimeOfDay.DAY]: [SpeciesId.SWANNA, SpeciesId.ARAQUANID],
    [TimeOfDay.DUSK]: [SpeciesId.AZUMARILL],
    [TimeOfDay.NIGHT]: [SpeciesId.AZUMARILL],
    [TimeOfDay.ALL]: [
      SpeciesId.GOLDUCK,
      SpeciesId.SLOWBRO,
      SpeciesId.SEAKING,
      SpeciesId.GYARADOS,
      SpeciesId.MASQUERAIN,
      SpeciesId.WISHIWASHI,
      SpeciesId.DREDNAW,
    ],
  },
  [BiomePoolTier.BOSS_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.BLASTOISE,
      SpeciesId.VAPOREON,
      SpeciesId.SLOWKING,
      SpeciesId.SAMUROTT,
      SpeciesId.GRENINJA,
      SpeciesId.INTELEON,
    ],
  },
  [BiomePoolTier.BOSS_SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.SUICUNE, SpeciesId.MESPRIT],
  },
  [BiomePoolTier.BOSS_ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [],
  },
};

export const lakeBiome = new Biome(
  BiomeId.LAKE,
  pokemonPool,
  townTrainerPool,
  townWeatherPool,
  townTerrainPool,
  "town",
);
