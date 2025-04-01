import { Biome } from "#app/data/biome";
import { townTrainerPool, townTerrainPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { BiomePoolTier } from "#enums/biome-pool-tier";
import { SpeciesId } from "#enums/species-id";
import { TimeOfDay } from "#enums/time-of-day";
import { WeatherType } from "#enums/weather-type";

const pokemonPool = {
  [BiomePoolTier.COMMON]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [SpeciesId.ALOLA_RATTATA, SpeciesId.ALOLA_MEOWTH],
    [TimeOfDay.NIGHT]: [SpeciesId.ALOLA_RATTATA, SpeciesId.ALOLA_MEOWTH],
    [TimeOfDay.ALL]: [
      SpeciesId.ORICORIO,
      SpeciesId.ALOLA_SANDSHREW,
      SpeciesId.ALOLA_VULPIX,
      SpeciesId.ALOLA_DIGLETT,
      SpeciesId.ALOLA_GEODUDE,
      SpeciesId.ALOLA_GRIMER,
    ],
  },
  [BiomePoolTier.UNCOMMON]: {
    [TimeOfDay.DAWN]: [SpeciesId.ALOLA_RAICHU, SpeciesId.ALOLA_EXEGGUTOR],
    [TimeOfDay.DAY]: [SpeciesId.ALOLA_RAICHU, SpeciesId.ALOLA_EXEGGUTOR],
    [TimeOfDay.DUSK]: [SpeciesId.ALOLA_MAROWAK],
    [TimeOfDay.NIGHT]: [SpeciesId.ALOLA_MAROWAK],
    [TimeOfDay.ALL]: [SpeciesId.BRUXISH],
  },
  [BiomePoolTier.RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [],
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
    [TimeOfDay.ALL]: [SpeciesId.BLACEPHALON],
  },
  [BiomePoolTier.BOSS]: {
    [TimeOfDay.DAWN]: [SpeciesId.ALOLA_RAICHU, SpeciesId.ALOLA_EXEGGUTOR],
    [TimeOfDay.DAY]: [SpeciesId.ALOLA_RAICHU, SpeciesId.ALOLA_EXEGGUTOR],
    [TimeOfDay.DUSK]: [SpeciesId.ALOLA_RATICATE, SpeciesId.ALOLA_PERSIAN, SpeciesId.ALOLA_MAROWAK],
    [TimeOfDay.NIGHT]: [SpeciesId.ALOLA_RATICATE, SpeciesId.ALOLA_PERSIAN, SpeciesId.ALOLA_MAROWAK],
    [TimeOfDay.ALL]: [
      SpeciesId.ORICORIO,
      SpeciesId.BRUXISH,
      SpeciesId.ALOLA_SANDSLASH,
      SpeciesId.ALOLA_NINETALES,
      SpeciesId.ALOLA_DUGTRIO,
      SpeciesId.ALOLA_GOLEM,
      SpeciesId.ALOLA_MUK,
    ],
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
    [TimeOfDay.ALL]: [SpeciesId.BLACEPHALON],
  },
  [BiomePoolTier.BOSS_ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [],
  },
};

/**
 * 1/8 for rain 2/8 for sun if dawn/day
 * 1/6 for rain if dusk/night
 */
const weatherPool = {
  [WeatherType.NONE]: 5,
  [WeatherType.SUNNY]: 2,
  [WeatherType.RAIN]: 1,
  [WeatherType.SANDSTORM]: 0,
  [WeatherType.HAIL]: 0,
  [WeatherType.SNOW]: 0,
  [WeatherType.FOG]: 0,
  [WeatherType.HEAVY_RAIN]: 0,
  [WeatherType.HARSH_SUN]: 0,
  [WeatherType.STRONG_WINDS]: 0,
};

export const islandBiome = new Biome(
  BiomeId.ISLAND,
  pokemonPool,
  townTrainerPool,
  weatherPool,
  townTerrainPool,
  "town",
);
