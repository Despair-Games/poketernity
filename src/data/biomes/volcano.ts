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
      SpeciesId.VULPIX,
      SpeciesId.GROWLITHE,
      SpeciesId.PONYTA,
      SpeciesId.SLUGMA,
      SpeciesId.NUMEL,
      SpeciesId.SALANDIT,
      SpeciesId.ROLYCOLY,
    ],
  },
  [BiomePoolTier.UNCOMMON]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.MAGMAR, SpeciesId.TORKOAL, SpeciesId.PANSEAR, SpeciesId.HEATMOR, SpeciesId.TURTONATOR],
  },
  [BiomePoolTier.RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.CHARMANDER,
      SpeciesId.CYNDAQUIL,
      SpeciesId.CHIMCHAR,
      SpeciesId.TEPIG,
      SpeciesId.FENNEKIN,
      SpeciesId.LITTEN,
      SpeciesId.SCORBUNNY,
      SpeciesId.CHARCADET,
    ],
  },
  [BiomePoolTier.SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.FLAREON,
      SpeciesId.ROTOM, // heat
      SpeciesId.LARVESTA,
      SpeciesId.HISUI_GROWLITHE,
    ],
  },
  [BiomePoolTier.ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.ENTEI, SpeciesId.HEATRAN, SpeciesId.VOLCANION, SpeciesId.CHI_YU],
  },
  [BiomePoolTier.BOSS]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.NINETALES,
      SpeciesId.ARCANINE,
      SpeciesId.RAPIDASH,
      SpeciesId.MAGCARGO,
      SpeciesId.CAMERUPT,
      SpeciesId.TORKOAL,
      SpeciesId.MAGMORTAR,
      SpeciesId.SIMISEAR,
      SpeciesId.HEATMOR,
      SpeciesId.SALAZZLE,
      SpeciesId.TURTONATOR,
      SpeciesId.COALOSSAL,
    ],
  },
  [BiomePoolTier.BOSS_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.CHARIZARD,
      SpeciesId.FLAREON,
      SpeciesId.TYPHLOSION,
      SpeciesId.INFERNAPE,
      SpeciesId.EMBOAR,
      SpeciesId.VOLCARONA,
      SpeciesId.DELPHOX,
      SpeciesId.INCINEROAR,
      SpeciesId.CINDERACE,
      SpeciesId.ARMAROUGE,
      SpeciesId.HISUI_ARCANINE,
    ],
  },
  [BiomePoolTier.BOSS_SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.MOLTRES,
      SpeciesId.ENTEI,
      SpeciesId.ROTOM,
      SpeciesId.HEATRAN,
      SpeciesId.VOLCANION,
      SpeciesId.CHI_YU,
    ],
  },
  [BiomePoolTier.BOSS_ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.RESHIRAM],
  },
};

const trainerPool = {
  [BiomePoolTier.COMMON]: [TrainerType.FIREBREATHER],
  [BiomePoolTier.UNCOMMON]: [],
  [BiomePoolTier.RARE]: [],
  [BiomePoolTier.SUPER_RARE]: [],
  [BiomePoolTier.ULTRA_RARE]: [],
  [BiomePoolTier.BOSS]: [TrainerType.BLAINE, TrainerType.FLANNERY, TrainerType.KABU],
  [BiomePoolTier.BOSS_RARE]: [],
  [BiomePoolTier.BOSS_SUPER_RARE]: [],
  [BiomePoolTier.BOSS_ULTRA_RARE]: [],
};

/**
 * 9/10 of Sunny during dawn/day
 */
const weatherPool = {
  [WeatherType.NONE]: 1,
  [WeatherType.SUNNY]: 9,
};

const terrainPool = {
  [TerrainType.NONE]: 1,
  [TerrainType.MISTY]: 0,
  [TerrainType.ELECTRIC]: 0,
  [TerrainType.GRASSY]: 0,
  [TerrainType.PSYCHIC]: 0,
};

export const volcanoBiome = new Biome(
  BiomeId.VOLCANO,
  pokemonPool,
  trainerPool,
  12,
  weatherPool,
  terrainPool,
  "volcano",
);
