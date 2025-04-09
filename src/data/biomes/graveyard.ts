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
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.GASTLY,
      SpeciesId.SHUPPET,
      SpeciesId.DUSKNOIR,
      SpeciesId.DRIFLOON,
      SpeciesId.LITWICK,
      SpeciesId.PHANTUMP,
      SpeciesId.PUMPKABOO,
      SpeciesId.GREAVARD,
    ],
  },
  [BiomePoolTier.UNCOMMON]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.CUBONE, SpeciesId.YAMASK, SpeciesId.SINISTEA],
  },
  [BiomePoolTier.RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.MISDREAVUS, SpeciesId.MIMIKYU, SpeciesId.FUECOCO, SpeciesId.CERULEDGE],
  },
  [BiomePoolTier.SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.SPIRITOMB],
  },
  [BiomePoolTier.ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.MARSHADOW, SpeciesId.SPECTRIER],
  },
  [BiomePoolTier.BOSS]: {
    [TimeOfDay.DAWN]: [SpeciesId.MAROWAK],
    [TimeOfDay.DAY]: [SpeciesId.MAROWAK],
    [TimeOfDay.DUSK]: [SpeciesId.MAROWAK],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.GENGAR,
      SpeciesId.BANETTE,
      SpeciesId.DRIFBLIM,
      SpeciesId.MISMAGIUS,
      SpeciesId.DUSKNOIR,
      SpeciesId.CHANDELURE,
      SpeciesId.TREVENANT,
      SpeciesId.GOURGEIST,
      SpeciesId.MIMIKYU,
      SpeciesId.POLTEAGEIST,
      SpeciesId.HOUNDSTONE,
    ],
  },
  [BiomePoolTier.BOSS_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.SKELEDIRGE, SpeciesId.CERULEDGE, SpeciesId.HISUI_TYPHLOSION],
  },
  [BiomePoolTier.BOSS_SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.MARSHADOW, SpeciesId.SPECTRIER],
  },
  [BiomePoolTier.BOSS_ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.GIRATINA],
  },
};

const trainerPool = {
  [BiomePoolTier.COMMON]: [TrainerType.PSYCHIC],
  [BiomePoolTier.UNCOMMON]: [TrainerType.HEX_MANIAC],
  [BiomePoolTier.RARE]: [],
  [BiomePoolTier.SUPER_RARE]: [],
  [BiomePoolTier.ULTRA_RARE]: [],
  [BiomePoolTier.BOSS]: [TrainerType.MORTY, TrainerType.ALLISTER, TrainerType.RYME],
  [BiomePoolTier.BOSS_RARE]: [],
  [BiomePoolTier.BOSS_SUPER_RARE]: [],
  [BiomePoolTier.BOSS_ULTRA_RARE]: [],
};

/**
 * 1/4 of fog
 */
const weatherPool = {
  [WeatherType.NONE]: 3,
  [WeatherType.FOG]: 1,
};

/**
 * 1/4 of misty
 */
const terrainPool: Partial<Record<TerrainType, number>> = {
  [TerrainType.NONE]: 3,
  [TerrainType.MISTY]: 1,
};

export const graveyardBiome = new Biome(
  BiomeId.GRAVEYARD,
  pokemonPool,
  trainerPool,
  8,
  weatherPool,
  terrainPool,
  "graveyard",
  3.232,
);
