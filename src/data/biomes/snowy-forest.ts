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
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [SpeciesId.SNEASEL, SpeciesId.TEDDIURSA, SpeciesId.SNOM],
    [TimeOfDay.NIGHT]: [SpeciesId.SNEASEL, SpeciesId.TEDDIURSA, SpeciesId.SNOM],
    [TimeOfDay.ALL]: [SpeciesId.SWINUB, SpeciesId.SNOVER, SpeciesId.EISCUE],
  },
  [BiomePoolTier.UNCOMMON]: {
    [TimeOfDay.DAWN]: [SpeciesId.SNEASEL, SpeciesId.TEDDIURSA, SpeciesId.STANTLER],
    [TimeOfDay.DAY]: [SpeciesId.SNEASEL, SpeciesId.TEDDIURSA, SpeciesId.STANTLER],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [],
  },
  [BiomePoolTier.RARE]: {
    [TimeOfDay.DAWN]: [SpeciesId.GALAR_DARUMAKA],
    [TimeOfDay.DAY]: [SpeciesId.GALAR_DARUMAKA],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.DELIBIRD, SpeciesId.ALOLA_SANDSHREW, SpeciesId.ALOLA_VULPIX],
  },
  [BiomePoolTier.SUPER_RARE]: {
    [TimeOfDay.DAWN]: [SpeciesId.HISUI_SNEASEL],
    [TimeOfDay.DAY]: [SpeciesId.HISUI_SNEASEL],
    [TimeOfDay.DUSK]: [SpeciesId.HISUI_ZORUA],
    [TimeOfDay.NIGHT]: [SpeciesId.HISUI_ZORUA],
    [TimeOfDay.ALL]: [SpeciesId.GALAR_MR_MIME, SpeciesId.ARCTOZOLT, SpeciesId.HISUI_AVALUGG],
  },
  [BiomePoolTier.ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.GLASTRIER, SpeciesId.CHIEN_PAO, SpeciesId.GALAR_ARTICUNO],
  },
  [BiomePoolTier.BOSS]: {
    [TimeOfDay.DAWN]: [SpeciesId.WYRDEER],
    [TimeOfDay.DAY]: [SpeciesId.WYRDEER],
    [TimeOfDay.DUSK]: [SpeciesId.FROSMOTH],
    [TimeOfDay.NIGHT]: [SpeciesId.FROSMOTH],
    [TimeOfDay.ALL]: [SpeciesId.ABOMASNOW, SpeciesId.URSALUNA],
  },
  [BiomePoolTier.BOSS_RARE]: {
    [TimeOfDay.DAWN]: [SpeciesId.SNEASLER, SpeciesId.GALAR_DARMANITAN],
    [TimeOfDay.DAY]: [SpeciesId.SNEASLER, SpeciesId.GALAR_DARMANITAN],
    [TimeOfDay.DUSK]: [SpeciesId.HISUI_ZOROARK],
    [TimeOfDay.NIGHT]: [SpeciesId.HISUI_ZOROARK],
    [TimeOfDay.ALL]: [SpeciesId.MR_RIME, SpeciesId.ARCTOZOLT, SpeciesId.ALOLA_SANDSLASH, SpeciesId.ALOLA_NINETALES],
  },
  [BiomePoolTier.BOSS_SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.GLASTRIER, SpeciesId.CHIEN_PAO],
  },
  [BiomePoolTier.BOSS_ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.ZACIAN, SpeciesId.GALAR_ARTICUNO],
  },
};

const trainerPool = {
  [BiomePoolTier.COMMON]: [TrainerType.SNOW_WORKER],
  [BiomePoolTier.UNCOMMON]: [],
  [BiomePoolTier.RARE]: [],
  [BiomePoolTier.SUPER_RARE]: [],
  [BiomePoolTier.ULTRA_RARE]: [],
  [BiomePoolTier.BOSS]: [TrainerType.CANDICE, TrainerType.MELONY],
  [BiomePoolTier.BOSS_RARE]: [],
  [BiomePoolTier.BOSS_SUPER_RARE]: [],
  [BiomePoolTier.BOSS_ULTRA_RARE]: [],
};

/**
 * 1/8 for hail, 7/8 for snow
 */
const weatherPool = {
  [WeatherType.HAIL]: 1,
  [WeatherType.SNOW]: 7,
};

export const snowyForestBiome = new Biome(
  BiomeId.SNOWY_FOREST,
  pokemonPool,
  trainerPool,
  8,
  weatherPool,
  townTerrainPool,
  "town",
);
