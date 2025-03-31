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
    [TimeOfDay.DUSK]: [SpeciesId.ALOLA_RATTATA, SpeciesId.ALOLA_MEOWTH],
    [TimeOfDay.NIGHT]: [SpeciesId.ALOLA_RATTATA, SpeciesId.ALOLA_MEOWTH],
    [TimeOfDay.ALL]: [
      SpeciesId.ORICORIO,
      SpeciesId.ALOLA_SANDSHREW,
      SpeciesId.ALOLA_VULPIX,
      SpeciesId.ALOLA_DIGLETT,
      SpeciesId.ALOLA_GEODUDE,
      SpeciesId.ALOLA_GRIMER,
    ],
  },
  [BiomePoolTier.UNCOMMON]: {
    [TimeOfDay.DAWN]: [SpeciesId.ALOLA_RAICHU, SpeciesId.ALOLA_EXEGGUTOR],
    [TimeOfDay.DAY]: [SpeciesId.ALOLA_RAICHU, SpeciesId.ALOLA_EXEGGUTOR],
    [TimeOfDay.DUSK]: [SpeciesId.ALOLA_MAROWAK],
    [TimeOfDay.NIGHT]: [SpeciesId.ALOLA_MAROWAK],
    [TimeOfDay.ALL]: [SpeciesId.BRUXISH],
  },
  [BiomePoolTier.RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [],
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
    [TimeOfDay.ALL]: [SpeciesId.BLACEPHALON],
  },
  [BiomePoolTier.BOSS]: {
    [TimeOfDay.DAWN]: [SpeciesId.ALOLA_RAICHU, SpeciesId.ALOLA_EXEGGUTOR],
    [TimeOfDay.DAY]: [SpeciesId.ALOLA_RAICHU, SpeciesId.ALOLA_EXEGGUTOR],
    [TimeOfDay.DUSK]: [SpeciesId.ALOLA_RATICATE, SpeciesId.ALOLA_PERSIAN, SpeciesId.ALOLA_MAROWAK],
    [TimeOfDay.NIGHT]: [SpeciesId.ALOLA_RATICATE, SpeciesId.ALOLA_PERSIAN, SpeciesId.ALOLA_MAROWAK],
    [TimeOfDay.ALL]: [
      SpeciesId.ORICORIO,
      SpeciesId.BRUXISH,
      SpeciesId.ALOLA_SANDSLASH,
      SpeciesId.ALOLA_NINETALES,
      SpeciesId.ALOLA_DUGTRIO,
      SpeciesId.ALOLA_GOLEM,
      SpeciesId.ALOLA_MUK,
    ],
  },
  [BiomePoolTier.BOSS_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [],
  },
  [BiomePoolTier.BOSS_SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.BLACEPHALON],
  },
  [BiomePoolTier.BOSS_ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [],
  },
};

export const islandBiome = new Biome(
  BiomeId.ISLAND,
  pokemonPool,
  townTrainerPool,
  townWeatherPool,
  townTerrainPool,
  "town",
);
