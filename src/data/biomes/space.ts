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
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [SpeciesId.SOLROCK],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [SpeciesId.LUNATONE],
    [TimeOfDay.ALL]: [SpeciesId.CLEFFA, SpeciesId.BRONZOR, SpeciesId.MUNNA, SpeciesId.MINIOR],
  },
  [BiomePoolTier.UNCOMMON]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.BALTOY, SpeciesId.ELGYEM],
  },
  [BiomePoolTier.RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.BELDUM, SpeciesId.SIGILYPH, SpeciesId.SOLOSIS],
  },
  [BiomePoolTier.SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.PORYGON],
  },
  [BiomePoolTier.ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [SpeciesId.SOLGALEO],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [SpeciesId.LUNALA],
    [TimeOfDay.ALL]: [SpeciesId.CELESTEELA],
  },
  [BiomePoolTier.BOSS]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [SpeciesId.SOLROCK],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [SpeciesId.LUNATONE],
    [TimeOfDay.ALL]: [
      SpeciesId.CLEFABLE,
      SpeciesId.BRONZONG,
      SpeciesId.MUSHARNA,
      SpeciesId.REUNICLUS,
      SpeciesId.MINIOR,
    ],
  },
  [BiomePoolTier.BOSS_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.METAGROSS, SpeciesId.PORYGON_Z],
  },
  [BiomePoolTier.BOSS_SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.CELESTEELA],
  },
  [BiomePoolTier.BOSS_ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [SpeciesId.SOLGALEO],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [SpeciesId.LUNALA],
    [TimeOfDay.ALL]: [SpeciesId.RAYQUAZA, SpeciesId.NECROZMA],
  },
};

// @todo this trainerPool is empty but space has a nonzero chance of spawning trainers hmmm
const trainerPool = {
  [BiomePoolTier.COMMON]: [],
  [BiomePoolTier.UNCOMMON]: [],
  [BiomePoolTier.RARE]: [],
  [BiomePoolTier.SUPER_RARE]: [],
  [BiomePoolTier.ULTRA_RARE]: [],
  [BiomePoolTier.BOSS]: [TrainerType.OLYMPIA],
  [BiomePoolTier.BOSS_RARE]: [],
  [BiomePoolTier.BOSS_SUPER_RARE]: [],
  [BiomePoolTier.BOSS_ULTRA_RARE]: [],
};

const weatherPool = {
  [WeatherType.NONE]: 1,
};

/**
 * 1/2 of psychic
 */
const terrainPool: Partial<Record<TerrainType, number>> = {
  [TerrainType.NONE]: 1,
  [TerrainType.PSYCHIC]: 1,
};

export const spaceBiome = new Biome(BiomeId.SPACE, pokemonPool, trainerPool, 16, weatherPool, terrainPool, "town");
