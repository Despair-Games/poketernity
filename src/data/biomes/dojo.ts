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
    [TimeOfDay.ALL]: [SpeciesId.MANKEY, SpeciesId.MAKUHITA, SpeciesId.MEDITITE, SpeciesId.STUFFUL, SpeciesId.CLOBBOPUS],
  },
  [BiomePoolTier.UNCOMMON]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.CROAGUNK, SpeciesId.SCRAGGY, SpeciesId.MIENFOO],
  },
  [BiomePoolTier.RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.HITMONLEE,
      SpeciesId.HITMONCHAN,
      SpeciesId.LUCARIO,
      SpeciesId.THROH,
      SpeciesId.SAWK,
      SpeciesId.PANCHAM,
    ],
  },
  [BiomePoolTier.SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.HITMONTOP, SpeciesId.GALLADE, SpeciesId.GALAR_FARFETCHD],
  },
  [BiomePoolTier.ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.TERRAKION, SpeciesId.KUBFU, SpeciesId.GALAR_ZAPDOS],
  },
  [BiomePoolTier.BOSS]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.HITMONLEE,
      SpeciesId.HITMONCHAN,
      SpeciesId.HARIYAMA,
      SpeciesId.MEDICHAM,
      SpeciesId.LUCARIO,
      SpeciesId.TOXICROAK,
      SpeciesId.THROH,
      SpeciesId.SAWK,
      SpeciesId.SCRAFTY,
      SpeciesId.MIENSHAO,
      SpeciesId.BEWEAR,
      SpeciesId.GRAPPLOCT,
      SpeciesId.ANNIHILAPE,
    ],
  },
  [BiomePoolTier.BOSS_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.HITMONTOP,
      SpeciesId.GALLADE,
      SpeciesId.PANGORO,
      SpeciesId.SIRFETCHD,
      SpeciesId.HISUI_DECIDUEYE,
    ],
  },
  [BiomePoolTier.BOSS_SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.TERRAKION, SpeciesId.URSHIFU],
  },
  [BiomePoolTier.BOSS_ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.ZAMAZENTA, SpeciesId.GALAR_ZAPDOS],
  },
};

export const dojoBiome = new Biome(
  BiomeId.DOJO,
  pokemonPool,
  townTrainerPool,
  townWeatherPool,
  townTerrainPool,
  "town",
);
