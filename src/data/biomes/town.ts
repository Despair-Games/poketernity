import { Biome } from "#app/data/biome";
import { BiomeId } from "#enums/biome-id";
import { BiomePoolTier } from "#enums/biome-pool-tier";
import { SpeciesId } from "#enums/species-id";
import { TerrainType } from "#enums/terrain-type";
import { TimeOfDay } from "#enums/time-of-day";
import { TrainerType } from "#enums/trainer-type";
import { WeatherType } from "#enums/weather-type";

/**
 * @todo Remove these exports. Currently exporting them as temporary
 * filler values for all other biomes.
 */
const pokemonPool: Record<BiomePoolTier, Record<TimeOfDay, SpeciesId[]>> = {
  [BiomePoolTier.COMMON]: {
    [TimeOfDay.DAWN]: [
      SpeciesId.CATERPIE,
      SpeciesId.SENTRET,
      SpeciesId.LEDYBA,
      SpeciesId.HOPPIP,
      SpeciesId.SUNKERN,
      SpeciesId.STARLY,
      SpeciesId.PIDOVE,
      SpeciesId.COTTONEE,
      SpeciesId.SCATTERBUG,
      SpeciesId.YUNGOOS,
      SpeciesId.SKWOVET,
    ],
    [TimeOfDay.DAY]: [
      SpeciesId.CATERPIE,
      SpeciesId.SENTRET,
      SpeciesId.HOPPIP,
      SpeciesId.SUNKERN,
      SpeciesId.SILCOON,
      SpeciesId.STARLY,
      SpeciesId.PIDOVE,
      SpeciesId.COTTONEE,
      SpeciesId.SCATTERBUG,
      SpeciesId.YUNGOOS,
      SpeciesId.SKWOVET,
    ],
    [TimeOfDay.DUSK]: [SpeciesId.WEEDLE, SpeciesId.POOCHYENA, SpeciesId.PATRAT, SpeciesId.PURRLOIN, SpeciesId.BLIPBUG],
    [TimeOfDay.NIGHT]: [
      SpeciesId.WEEDLE,
      SpeciesId.HOOTHOOT,
      SpeciesId.SPINARAK,
      SpeciesId.POOCHYENA,
      SpeciesId.CASCOON,
      SpeciesId.PATRAT,
      SpeciesId.PURRLOIN,
      SpeciesId.BLIPBUG,
    ],
    [TimeOfDay.ALL]: [
      SpeciesId.PIDGEY,
      SpeciesId.RATTATA,
      SpeciesId.SPEAROW,
      SpeciesId.ZIGZAGOON,
      SpeciesId.WURMPLE,
      SpeciesId.TAILLOW,
      SpeciesId.BIDOOF,
      SpeciesId.LILLIPUP,
      SpeciesId.FLETCHLING,
      SpeciesId.WOOLOO,
      SpeciesId.LECHONK,
    ],
  },
  [BiomePoolTier.UNCOMMON]: {
    [TimeOfDay.DAWN]: [
      SpeciesId.BELLSPROUT,
      SpeciesId.POOCHYENA,
      SpeciesId.LOTAD,
      SpeciesId.SKITTY,
      SpeciesId.COMBEE,
      SpeciesId.CHERUBI,
      SpeciesId.PATRAT,
      SpeciesId.MINCCINO,
      SpeciesId.PAWMI,
    ],
    [TimeOfDay.DAY]: [
      SpeciesId.NIDORAN_F,
      SpeciesId.NIDORAN_M,
      SpeciesId.BELLSPROUT,
      SpeciesId.POOCHYENA,
      SpeciesId.LOTAD,
      SpeciesId.SKITTY,
      SpeciesId.COMBEE,
      SpeciesId.CHERUBI,
      SpeciesId.PATRAT,
      SpeciesId.MINCCINO,
      SpeciesId.PAWMI,
    ],
    [TimeOfDay.DUSK]: [
      SpeciesId.EKANS,
      SpeciesId.ODDISH,
      SpeciesId.MEOWTH,
      SpeciesId.SPINARAK,
      SpeciesId.SEEDOT,
      SpeciesId.SHROOMISH,
      SpeciesId.KRICKETOT,
      SpeciesId.VENIPEDE,
    ],
    [TimeOfDay.NIGHT]: [
      SpeciesId.EKANS,
      SpeciesId.ODDISH,
      SpeciesId.PARAS,
      SpeciesId.VENONAT,
      SpeciesId.MEOWTH,
      SpeciesId.SEEDOT,
      SpeciesId.SHROOMISH,
      SpeciesId.KRICKETOT,
      SpeciesId.VENIPEDE,
    ],
    [TimeOfDay.ALL]: [SpeciesId.NINCADA, SpeciesId.WHISMUR, SpeciesId.FIDOUGH],
  },
  [BiomePoolTier.RARE]: {
    [TimeOfDay.DAWN]: [SpeciesId.TANDEMAUS],
    [TimeOfDay.DAY]: [SpeciesId.TANDEMAUS],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.ABRA, SpeciesId.SURSKIT, SpeciesId.ROOKIDEE],
  },
  [BiomePoolTier.SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.EEVEE, SpeciesId.RALTS],
  },
  [BiomePoolTier.ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.DITTO],
  },
  [BiomePoolTier.BOSS]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [],
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
    [TimeOfDay.ALL]: [],
  },
  [BiomePoolTier.BOSS_ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [],
  },
};

const trainerPool: Record<BiomePoolTier, TrainerType[]> = {
  [BiomePoolTier.COMMON]: [TrainerType.YOUNGSTER],
  [BiomePoolTier.UNCOMMON]: [],
  [BiomePoolTier.RARE]: [],
  [BiomePoolTier.SUPER_RARE]: [],
  [BiomePoolTier.ULTRA_RARE]: [],
  [BiomePoolTier.BOSS]: [],
  [BiomePoolTier.BOSS_RARE]: [],
  [BiomePoolTier.BOSS_SUPER_RARE]: [],
  [BiomePoolTier.BOSS_ULTRA_RARE]: [],
};

const weatherPool: Partial<Record<WeatherType, number>> = {
  [WeatherType.NONE]: 1,
};

export const townTerrainPool: Record<TerrainType, number> = {
  [TerrainType.NONE]: 1,
  [TerrainType.MISTY]: 0,
  [TerrainType.ELECTRIC]: 0,
  [TerrainType.GRASSY]: 0,
  [TerrainType.PSYCHIC]: 0,
};

export const townBiome = new Biome(BiomeId.TOWN, pokemonPool, trainerPool, 0, weatherPool, townTerrainPool, "town");
