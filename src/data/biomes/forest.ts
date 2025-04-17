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
    [TimeOfDay.DAWN]: [
      SpeciesId.CATERPIE,
      SpeciesId.BELLSPROUT,
      SpeciesId.COMBEE,
      SpeciesId.PETILIL,
      SpeciesId.DEERLING,
      SpeciesId.SCATTERBUG,
    ],
    [TimeOfDay.DAY]: [
      SpeciesId.CATERPIE,
      SpeciesId.BELLSPROUT,
      SpeciesId.COMBEE,
      SpeciesId.PETILIL,
      SpeciesId.DEERLING,
      SpeciesId.SCATTERBUG,
      SpeciesId.BEAUTIFLY,
    ],
    [TimeOfDay.DUSK]: [SpeciesId.WEEDLE, SpeciesId.PINECO, SpeciesId.SEEDOT, SpeciesId.SHROOMISH, SpeciesId.VENIPEDE],
    [TimeOfDay.NIGHT]: [
      SpeciesId.WEEDLE,
      SpeciesId.VENONAT,
      SpeciesId.SPINARAK,
      SpeciesId.PINECO,
      SpeciesId.SEEDOT,
      SpeciesId.SHROOMISH,
      SpeciesId.VENIPEDE,
      SpeciesId.DUSTOX,
    ],
    [TimeOfDay.ALL]: [SpeciesId.TAROUNTULA, SpeciesId.NYMBLE, SpeciesId.SHROODLE],
  },
  [BiomePoolTier.UNCOMMON]: {
    [TimeOfDay.DAWN]: [SpeciesId.ROSELIA, SpeciesId.MOTHIM, SpeciesId.SEWADDLE],
    [TimeOfDay.DAY]: [SpeciesId.ROSELIA, SpeciesId.MOTHIM, SpeciesId.SEWADDLE],
    [TimeOfDay.DUSK]: [SpeciesId.SPINARAK, SpeciesId.DOTTLER],
    [TimeOfDay.NIGHT]: [SpeciesId.HOOTHOOT, SpeciesId.ROCKRUFF, SpeciesId.DOTTLER],
    [TimeOfDay.ALL]: [SpeciesId.EKANS, SpeciesId.TEDDIURSA, SpeciesId.BURMY, SpeciesId.PANSAGE],
  },
  [BiomePoolTier.RARE]: {
    [TimeOfDay.DAWN]: [SpeciesId.EXEGGCUTE, SpeciesId.STANTLER],
    [TimeOfDay.DAY]: [SpeciesId.EXEGGCUTE, SpeciesId.STANTLER],
    [TimeOfDay.DUSK]: [SpeciesId.SCYTHER],
    [TimeOfDay.NIGHT]: [SpeciesId.SCYTHER],
    [TimeOfDay.ALL]: [
      SpeciesId.HERACROSS,
      SpeciesId.TREECKO,
      SpeciesId.TROPIUS,
      SpeciesId.KARRABLAST,
      SpeciesId.SHELMET,
      SpeciesId.CHESPIN,
      SpeciesId.ROWLET,
      SpeciesId.SQUAWKABILLY,
      SpeciesId.TOEDSCOOL,
    ],
  },
  [BiomePoolTier.SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [SpeciesId.BLOODMOON_URSALUNA],
    [TimeOfDay.ALL]: [SpeciesId.DURANT],
  },
  [BiomePoolTier.ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.KARTANA, SpeciesId.WO_CHIEN],
  },
  [BiomePoolTier.BOSS]: {
    [TimeOfDay.DAWN]: [
      SpeciesId.VICTREEBEL,
      SpeciesId.MOTHIM,
      SpeciesId.VESPIQUEN,
      SpeciesId.LILLIGANT,
      SpeciesId.SAWSBUCK,
    ],
    [TimeOfDay.DAY]: [
      SpeciesId.VICTREEBEL,
      SpeciesId.BEAUTIFLY,
      SpeciesId.MOTHIM,
      SpeciesId.VESPIQUEN,
      SpeciesId.LILLIGANT,
      SpeciesId.SAWSBUCK,
    ],
    [TimeOfDay.DUSK]: [
      SpeciesId.ARIADOS,
      SpeciesId.FORRETRESS,
      SpeciesId.SHIFTRY,
      SpeciesId.BRELOOM,
      SpeciesId.SCOLIPEDE,
      SpeciesId.ORBEETLE,
    ],
    [TimeOfDay.NIGHT]: [
      SpeciesId.VENOMOTH,
      SpeciesId.NOCTOWL,
      SpeciesId.ARIADOS,
      SpeciesId.FORRETRESS,
      SpeciesId.DUSTOX,
      SpeciesId.SHIFTRY,
      SpeciesId.BRELOOM,
      SpeciesId.SCOLIPEDE,
      SpeciesId.ORBEETLE,
    ],
    [TimeOfDay.ALL]: [SpeciesId.WORMADAM, SpeciesId.SIMISAGE, SpeciesId.SPIDOPS, SpeciesId.LOKIX, SpeciesId.GRAFAIAI],
  },
  [BiomePoolTier.BOSS_RARE]: {
    [TimeOfDay.DAWN]: [SpeciesId.STANTLER],
    [TimeOfDay.DAY]: [SpeciesId.STANTLER],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [SpeciesId.LYCANROC, SpeciesId.BLOODMOON_URSALUNA],
    [TimeOfDay.ALL]: [
      SpeciesId.HERACROSS,
      SpeciesId.SCEPTILE,
      SpeciesId.ESCAVALIER,
      SpeciesId.ACCELGOR,
      SpeciesId.DURANT,
      SpeciesId.CHESNAUGHT,
      SpeciesId.DECIDUEYE,
      SpeciesId.TOEDSCRUEL,
    ],
  },
  [BiomePoolTier.BOSS_SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.KARTANA, SpeciesId.WO_CHIEN],
  },
  [BiomePoolTier.BOSS_ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.CALYREX],
  },
};

const trainerPool = {
  [BiomePoolTier.COMMON]: [TrainerType.RANGER],
  [BiomePoolTier.UNCOMMON]: [],
  [BiomePoolTier.RARE]: [],
  [BiomePoolTier.SUPER_RARE]: [],
  [BiomePoolTier.ULTRA_RARE]: [],
  [BiomePoolTier.BOSS]: [TrainerType.BUGSY, TrainerType.BURGH, TrainerType.KATY],
  [BiomePoolTier.BOSS_RARE]: [],
  [BiomePoolTier.BOSS_SUPER_RARE]: [],
  [BiomePoolTier.BOSS_ULTRA_RARE]: [],
};

/**
 * 5/13 of rain
 */
const weatherPool = {
  [WeatherType.NONE]: 8,
  [WeatherType.RAIN]: 5,
};

/**
 * 1/4 of grassy
 */
const terrainPool: Partial<Record<TerrainType, number>> = {
  [TerrainType.NONE]: 3,
  [TerrainType.GRASSY]: 1,
};

export const forestBiome = new Biome(
  BiomeId.FOREST,
  pokemonPool,
  trainerPool,
  8,
  weatherPool,
  terrainPool,
  "forest",
  4.294,
);
