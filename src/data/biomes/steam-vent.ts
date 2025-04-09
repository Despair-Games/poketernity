import { Biome } from "#app/data/biome";
import { BiomeId } from "#enums/biome-id";
import { BiomePoolTier } from "#enums/biome-pool-tier";
import { SpeciesId } from "#enums/species-id";
import { TerrainType } from "#enums/terrain-type";
import { TimeOfDay } from "#enums/time-of-day";
import { TrainerType } from "#enums/trainer-type";
import { WeatherType } from "#enums/weather-type";

/**
 * TODO: Get original art and music assets
 */

const pokemonPool = {
  [BiomePoolTier.COMMON]: {
    [TimeOfDay.DAWN]: [SpeciesId.GROWLITHE],
    [TimeOfDay.DAY]: [SpeciesId.GROWLITHE],
    [TimeOfDay.DUSK]: [SpeciesId.VULPIX],
    [TimeOfDay.NIGHT]: [SpeciesId.VULPIX],
    [TimeOfDay.ALL]: [
      SpeciesId.PONYTA,
      SpeciesId.SLOWPOKE,
      SpeciesId.WOOPER,
      SpeciesId.SLUGMA,
      SpeciesId.SLAKOTH,
      SpeciesId.MAKUHITA,
      SpeciesId.NUMEL,
      SpeciesId.SANDILE,
      SpeciesId.FLETCHLING,
      SpeciesId.LITLEO,
    ],
  },
  [BiomePoolTier.UNCOMMON]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.MAGBY,
      SpeciesId.TORKOAL,
      SpeciesId.BARBOACH,
      SpeciesId.HIPPOPOTAS,
      SpeciesId.PANSAGE,
      SpeciesId.PANSEAR,
      SpeciesId.PANPOUR,
      SpeciesId.THROH,
      SpeciesId.SAWK,
      SpeciesId.SKRELP,
    ],
  },
  [BiomePoolTier.RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.CYNDAQUIL,
      SpeciesId.MUNCHLAX,
      SpeciesId.KECLEON,
      SpeciesId.DARUMAKA,
      SpeciesId.TURTONATOR,
    ],
  },
  [BiomePoolTier.SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.LARVESTA],
  },
  [BiomePoolTier.ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.VOLCANION, SpeciesId.CHI_YU],
  },
  [BiomePoolTier.BOSS]: {
    [TimeOfDay.DAWN]: [SpeciesId.ARCANINE],
    [TimeOfDay.DAY]: [SpeciesId.ARCANINE],
    [TimeOfDay.DUSK]: [SpeciesId.NINETALES],
    [TimeOfDay.NIGHT]: [SpeciesId.NINETALES],
    [TimeOfDay.ALL]: [
      SpeciesId.RAPIDASH,
      SpeciesId.SLOWBRO,
      SpeciesId.MAKUHITA,
      SpeciesId.SLAKING,
      SpeciesId.SIMIPOUR,
      SpeciesId.SIMISAGE,
      SpeciesId.SIMISEAR,
      SpeciesId.PYROAR,
      SpeciesId.TALONFLAME,
    ],
  },
  [BiomePoolTier.BOSS_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.TYPHLOSION,
      SpeciesId.SNORLAX,
      SpeciesId.VOLCARONA,
      SpeciesId.DARUMAKA,
      SpeciesId.TURTONATOR,
    ],
  },
  [BiomePoolTier.BOSS_SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.VOLCANION, SpeciesId.CHI_YU],
  },
  [BiomePoolTier.BOSS_ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [],
  },
};

const trainerPool = {
  [BiomePoolTier.COMMON]: [TrainerType.HIKER, TrainerType.PARASOL_LADY, TrainerType.BACKPACKER],
  [BiomePoolTier.UNCOMMON]: [],
  [BiomePoolTier.RARE]: [],
  [BiomePoolTier.SUPER_RARE]: [],
  [BiomePoolTier.ULTRA_RARE]: [],
  [BiomePoolTier.BOSS]: [TrainerType.FLANNERY],
  [BiomePoolTier.BOSS_RARE]: [],
  [BiomePoolTier.BOSS_SUPER_RARE]: [],
  [BiomePoolTier.BOSS_ULTRA_RARE]: [],
};

/**
 * 1/4 of Sunny during dawn/day
 */
const weatherPool = {
  [WeatherType.NONE]: 3,
  [WeatherType.SUNNY]: 1,
};

const terrainPool = {
  [TerrainType.NONE]: 1,
};

export const steamVentBiome = new Biome(
  BiomeId.STEAM_VENT,
  pokemonPool,
  trainerPool,
  12,
  weatherPool,
  terrainPool,
  "volcano",
  5.116,
);
