import { Biome } from "#app/data/biome";
import { townTrainerPool, townWeatherPool, townTerrainPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { BiomePoolTier } from "#enums/biome-pool-tier";
import { SpeciesId } from "#enums/species-id";
import { TimeOfDay } from "#enums/time-of-day";

const pokemonPool = {
  [BiomePoolTier.COMMON]: {
    [TimeOfDay.DAWN]: [SpeciesId.HOPPIP, SpeciesId.SUNKERN, SpeciesId.COTTONEE, SpeciesId.PETILIL],
    [TimeOfDay.DAY]: [SpeciesId.HOPPIP, SpeciesId.SUNKERN, SpeciesId.COTTONEE, SpeciesId.PETILIL],
    [TimeOfDay.DUSK]: [SpeciesId.SEEDOT, SpeciesId.SHROOMISH],
    [TimeOfDay.NIGHT]: [SpeciesId.SEEDOT, SpeciesId.SHROOMISH],
    [TimeOfDay.ALL]: [],
  },
  [BiomePoolTier.UNCOMMON]: {
    [TimeOfDay.DAWN]: [SpeciesId.COMBEE, SpeciesId.CHERUBI],
    [TimeOfDay.DAY]: [SpeciesId.COMBEE, SpeciesId.CHERUBI],
    [TimeOfDay.DUSK]: [SpeciesId.FOONGUS],
    [TimeOfDay.NIGHT]: [SpeciesId.FOONGUS],
    [TimeOfDay.ALL]: [],
  },
  [BiomePoolTier.RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.BULBASAUR, SpeciesId.GROWLITHE, SpeciesId.TURTWIG],
  },
  [BiomePoolTier.SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.BONSLY],
  },
  [BiomePoolTier.ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.VIRIZION],
  },
  [BiomePoolTier.BOSS]: {
    [TimeOfDay.DAWN]: [SpeciesId.JUMPLUFF, SpeciesId.SUNFLORA, SpeciesId.WHIMSICOTT],
    [TimeOfDay.DAY]: [SpeciesId.JUMPLUFF, SpeciesId.SUNFLORA, SpeciesId.WHIMSICOTT],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [],
  },
  [BiomePoolTier.BOSS_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.VENUSAUR, SpeciesId.SUDOWOODO, SpeciesId.TORTERRA],
  },
  [BiomePoolTier.BOSS_SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.VIRIZION],
  },
  [BiomePoolTier.BOSS_ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [],
  },
};

export const grassBiome = new Biome(
  BiomeId.GRASS,
  pokemonPool,
  townTrainerPool,
  townWeatherPool,
  townTerrainPool,
  "town",
);
