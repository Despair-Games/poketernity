import { Biome } from "#data/biome";
import { BiomeId } from "#enums/biome-id";
import { BiomePoolTier } from "#enums/biome-pool-tier";
import { SpeciesId } from "#enums/species-id";
import { TerrainType } from "#enums/terrain-type";
import { TimeOfDay } from "#enums/time-of-day";
import { TrainerType } from "#enums/trainer-type";
import { WeatherType } from "#enums/weather-type";

/**
 * TODO: Add original art and audio assets
 */

const pokemonPool = {
  [BiomePoolTier.COMMON]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.MAGNEMITE,
      SpeciesId.NOSEPASS,
      SpeciesId.PLUSLE,
      SpeciesId.MINUN,
      SpeciesId.ROGGENROLA,
      SpeciesId.JOLTIK,
      SpeciesId.GRUBBIN,
      SpeciesId.ALOLA_DIGLETT,
      SpeciesId.ALOLA_GEODUDE,
    ],
  },
  [BiomePoolTier.UNCOMMON]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.PORYGON, SpeciesId.SABLEYE, SpeciesId.KLINK, SpeciesId.ORBEETLE, SpeciesId.SOLOSIS],
  },
  [BiomePoolTier.RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.ELEKID,
      SpeciesId.DUNSPARCE,
      SpeciesId.DRILBUR,
      SpeciesId.FERROSEED,
      SpeciesId.TYNAMO,
      SpeciesId.CHESPIN,
      SpeciesId.MINIOR,
    ],
  },
  [BiomePoolTier.SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.BELDUM, SpeciesId.ROTOM],
  },
  [BiomePoolTier.ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.SANDY_SHOCKS, SpeciesId.IRON_THORNS],
  },
  [BiomePoolTier.BOSS]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.MAGNEZONE,
      SpeciesId.PROBOPASS,
      SpeciesId.GIGALITH,
      SpeciesId.GALVANTULA,
      SpeciesId.VIKAVOLT,
      SpeciesId.ALOLA_GOLEM,
      SpeciesId.ALOLA_DUGTRIO,
    ],
  },
  [BiomePoolTier.BOSS_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.ELECTIVIRE,
      SpeciesId.DUDUNSPARCE,
      SpeciesId.EXCADRILL,
      SpeciesId.FERROTHORN,
      SpeciesId.EELEKTROSS,
      SpeciesId.ROTOM,
    ],
  },
  [BiomePoolTier.BOSS_SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.METAGROSS, SpeciesId.SANDY_SHOCKS, SpeciesId.IRON_THORNS],
  },
  [BiomePoolTier.BOSS_ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.ZEKROM],
  },
};

const trainerPool = {
  [BiomePoolTier.COMMON]: [TrainerType.SCIENTIST, TrainerType.HIKER],
  [BiomePoolTier.UNCOMMON]: [TrainerType.ACE_TRAINER],
  [BiomePoolTier.RARE]: [],
  [BiomePoolTier.SUPER_RARE]: [],
  [BiomePoolTier.ULTRA_RARE]: [],
  [BiomePoolTier.BOSS]: [TrainerType.CLAY, TrainerType.ELESA],
  [BiomePoolTier.BOSS_RARE]: [],
  [BiomePoolTier.BOSS_SUPER_RARE]: [],
  [BiomePoolTier.BOSS_ULTRA_RARE]: [],
};

const weatherPool = {
  [WeatherType.NONE]: 1,
};

/**
 * 1/2 of Electric terrain
 */
const terrainPool: Partial<Record<TerrainType, number>> = {
  [TerrainType.NONE]: 1,
  [TerrainType.ELECTRIC]: 1,
};

export const chargestoneCaveBiome = new Biome(
  BiomeId.CHARGESTONE_CAVE,
  pokemonPool,
  trainerPool,
  6,
  weatherPool,
  terrainPool,
  "chargestone_cave",
  2.81,
);
