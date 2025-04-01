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

export const fairyCave = new Biome(
  BiomeId.FAIRY_CAVE,
  pokemonPool,
  townTrainerPool,
  townWeatherPool,
  townTerrainPool,
  "town",
);
