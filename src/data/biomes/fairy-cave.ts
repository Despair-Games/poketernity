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
      SpeciesId.IGGLYBUFF,
      SpeciesId.AZURILL,
      SpeciesId.MAWILE,
      SpeciesId.SPRITZEE,
      SpeciesId.SWIRLIX,
      SpeciesId.CUTIEFLY,
      SpeciesId.MORELULL,
      SpeciesId.MILCERY,
    ],
  },
  [BiomePoolTier.UNCOMMON]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.CLEFAIRY,
      SpeciesId.TOGETIC,
      SpeciesId.GARDEVOIR,
      SpeciesId.CARBINK,
      SpeciesId.COMFEY,
      SpeciesId.HATENNA,
    ],
  },
  [BiomePoolTier.RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.AUDINO, SpeciesId.ETERNAL_FLOETTE],
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
    [TimeOfDay.ALL]: [SpeciesId.DIANCIE, SpeciesId.ENAMORUS],
  },
  [BiomePoolTier.BOSS]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.WIGGLYTUFF,
      SpeciesId.MAWILE,
      SpeciesId.TOGEKISS,
      SpeciesId.AUDINO,
      SpeciesId.AROMATISSE,
      SpeciesId.SLURPUFF,
      SpeciesId.CARBINK,
      SpeciesId.RIBOMBEE,
      SpeciesId.SHIINOTIC,
      SpeciesId.COMFEY,
      SpeciesId.HATTERENE,
      SpeciesId.ALCREMIE,
    ],
  },
  [BiomePoolTier.BOSS_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.ETERNAL_FLOETTE],
  },
  [BiomePoolTier.BOSS_SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.DIANCIE, SpeciesId.ENAMORUS],
  },
  [BiomePoolTier.BOSS_ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.XERNEAS],
  },
};

const trainerPool = {
  [BiomePoolTier.COMMON]: [TrainerType.BEAUTY],
  [BiomePoolTier.UNCOMMON]: [TrainerType.ACE_TRAINER, TrainerType.BREEDER],
  [BiomePoolTier.RARE]: [],
  [BiomePoolTier.SUPER_RARE]: [],
  [BiomePoolTier.ULTRA_RARE]: [],
  [BiomePoolTier.BOSS]: [TrainerType.VALERIE, TrainerType.OPAL, TrainerType.BEDE],
  [BiomePoolTier.BOSS_RARE]: [],
  [BiomePoolTier.BOSS_SUPER_RARE]: [],
  [BiomePoolTier.BOSS_ULTRA_RARE]: [],
};

const weatherPool = {
  [WeatherType.NONE]: 1,
};

/**
 * 1/2 of misty
 */
const terrainPool: Partial<Record<TerrainType, number>> = {
  [TerrainType.NONE]: 1,
  [TerrainType.MISTY]: 1,
};

export const fairyCave = new Biome(BiomeId.FAIRY_CAVE, pokemonPool, trainerPool, 12, weatherPool, terrainPool, "town");
