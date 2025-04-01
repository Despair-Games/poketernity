import { Biome } from "#app/data/biome";
import { townTrainerPool, townWeatherPool, townTerrainPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { BiomePoolTier } from "#enums/biome-pool-tier";
import { SpeciesId } from "#enums/species-id";
import { TimeOfDay } from "#enums/time-of-day";

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

export const badlandsBiome = new Biome(
  BiomeId.BADLANDS,
  pokemonPool,
  townTrainerPool,
  townWeatherPool,
  townTerrainPool,
  "town",
);
