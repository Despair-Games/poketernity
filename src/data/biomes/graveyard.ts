import { Biome } from "#app/data/biome";
import { townTrainerPool, townWeatherPool, townTerrainPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { BiomePoolTier } from "#enums/biome-pool-tier";
import { SpeciesId } from "#enums/species-id";
import { TimeOfDay } from "#enums/time-of-day";

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

export const graveyardBiome = new Biome(
  BiomeId.GRAVEYARD,
  pokemonPool,
  townTrainerPool,
  townWeatherPool,
  townTerrainPool,
  "town",
);
