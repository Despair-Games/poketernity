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
    [TimeOfDay.DAWN]: [SpeciesId.LEDYBA, SpeciesId.BUDEW, SpeciesId.COTTONEE, SpeciesId.MINCCINO],
    [TimeOfDay.DAY]: [SpeciesId.BUDEW, SpeciesId.COTTONEE, SpeciesId.MINCCINO],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.BLITZLE, SpeciesId.FLABEBE, SpeciesId.CUTIEFLY, SpeciesId.GOSSIFLEUR, SpeciesId.WOOLOO],
  },
  [BiomePoolTier.UNCOMMON]: {
    [TimeOfDay.DAWN]: [SpeciesId.PONYTA, SpeciesId.SNUBBULL, SpeciesId.SKITTY, SpeciesId.BOUFFALANT, SpeciesId.SMOLIV],
    [TimeOfDay.DAY]: [SpeciesId.PONYTA, SpeciesId.SNUBBULL, SpeciesId.SKITTY, SpeciesId.BOUFFALANT, SpeciesId.SMOLIV],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.IGGLYBUFF,
      SpeciesId.MAREEP,
      SpeciesId.GARDEVOIR,
      SpeciesId.GLAMEOW,
      SpeciesId.ORICORIO,
    ],
  },
  [BiomePoolTier.RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [SpeciesId.VOLBEAT, SpeciesId.ILLUMISE],
    [TimeOfDay.ALL]: [
      SpeciesId.TAUROS,
      SpeciesId.EEVEE,
      SpeciesId.MILTANK,
      SpeciesId.SPINDA,
      SpeciesId.APPLIN,
      SpeciesId.SPRIGATITO,
    ],
  },
  [BiomePoolTier.SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.CHANSEY, SpeciesId.SYLVEON],
  },
  [BiomePoolTier.ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.MELOETTA],
  },
  [BiomePoolTier.BOSS]: {
    [TimeOfDay.DAWN]: [
      SpeciesId.LEDIAN,
      SpeciesId.GRANBULL,
      SpeciesId.DELCATTY,
      SpeciesId.ROSERADE,
      SpeciesId.CINCCINO,
      SpeciesId.BOUFFALANT,
      SpeciesId.ARBOLIVA,
    ],
    [TimeOfDay.DAY]: [
      SpeciesId.GRANBULL,
      SpeciesId.DELCATTY,
      SpeciesId.ROSERADE,
      SpeciesId.CINCCINO,
      SpeciesId.BOUFFALANT,
      SpeciesId.ARBOLIVA,
    ],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.TAUROS,
      SpeciesId.MILTANK,
      SpeciesId.GARDEVOIR,
      SpeciesId.PURUGLY,
      SpeciesId.ZEBSTRIKA,
      SpeciesId.FLORGES,
      SpeciesId.RIBOMBEE,
      SpeciesId.DUBWOOL,
    ],
  },
  [BiomePoolTier.BOSS_RARE]: {
    [TimeOfDay.DAWN]: [SpeciesId.HISUI_LILLIGANT],
    [TimeOfDay.DAY]: [SpeciesId.HISUI_LILLIGANT],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.BLISSEY,
      SpeciesId.SYLVEON,
      SpeciesId.FLAPPLE,
      SpeciesId.APPLETUN,
      SpeciesId.MEOWSCARADA,
      SpeciesId.HYDRAPPLE,
    ],
  },
  [BiomePoolTier.BOSS_SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.MELOETTA],
  },
  [BiomePoolTier.BOSS_ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.SHAYMIN],
  },
};

const trainerPool = {
  [BiomePoolTier.COMMON]: [TrainerType.PARASOL_LADY],
  [BiomePoolTier.UNCOMMON]: [TrainerType.ACE_TRAINER, TrainerType.BREEDER],
  [BiomePoolTier.RARE]: [],
  [BiomePoolTier.SUPER_RARE]: [],
  [BiomePoolTier.ULTRA_RARE]: [],
  [BiomePoolTier.BOSS]: [TrainerType.LENORA, TrainerType.MILO],
  [BiomePoolTier.BOSS_RARE]: [],
  [BiomePoolTier.BOSS_SUPER_RARE]: [],
  [BiomePoolTier.BOSS_ULTRA_RARE]: [],
};

/**
 * 1/2 of sun during dawn/day
 */
const weatherPool = {
  [WeatherType.NONE]: 1,
  [WeatherType.SUNNY]: 1,
};

/**
 * 1/4 for misty, 1/4 for grassy
 */
const terrainPool: Partial<Record<TerrainType, number>> = {
  [TerrainType.NONE]: 2,
  [TerrainType.MISTY]: 1,
  [TerrainType.GRASSY]: 1,
};

export const meadowBiome = new Biome(
  BiomeId.MEADOW,
  pokemonPool,
  trainerPool,
  8,
  weatherPool,
  terrainPool,
  "meadow",
  3.891,
);
