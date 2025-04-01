import { Biome } from "#app/data/biome";
import { townTrainerPool, townTerrainPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { BiomePoolTier } from "#enums/biome-pool-tier";
import { SpeciesId } from "#enums/species-id";
import { TimeOfDay } from "#enums/time-of-day";
import { WeatherType } from "#enums/weather-type";

const pokemonPool = {
  [BiomePoolTier.COMMON]: {
    [TimeOfDay.DAWN]: [SpeciesId.BAGON, SpeciesId.GOOMY, SpeciesId.JANGMO_O],
    [TimeOfDay.DAY]: [SpeciesId.BAGON, SpeciesId.GOOMY, SpeciesId.JANGMO_O],
    [TimeOfDay.DUSK]: [SpeciesId.LARVITAR],
    [TimeOfDay.NIGHT]: [SpeciesId.LARVITAR],
    [TimeOfDay.ALL]: [SpeciesId.TRAPINCH, SpeciesId.GIBLE, SpeciesId.AXEW],
  },
  [BiomePoolTier.UNCOMMON]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [SpeciesId.DEINO],
    [TimeOfDay.NIGHT]: [SpeciesId.DEINO],
    [TimeOfDay.ALL]: [SpeciesId.SWABLU, SpeciesId.DRAMPA, SpeciesId.CYCLIZAR],
  },
  [BiomePoolTier.RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [SpeciesId.DREEPY],
    [TimeOfDay.NIGHT]: [SpeciesId.DREEPY],
    [TimeOfDay.ALL]: [SpeciesId.DRATINI, SpeciesId.FRIGIBAX],
  },
  [BiomePoolTier.SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.AERODACTYL,
      SpeciesId.DRUDDIGON,
      SpeciesId.TYRUNT,
      SpeciesId.DRACOZOLT,
      SpeciesId.DRACOVISH,
    ],
  },
  [BiomePoolTier.ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.REGIDRAGO],
  },
  [BiomePoolTier.BOSS]: {
    [TimeOfDay.DAWN]: [SpeciesId.SALAMENCE, SpeciesId.GOODRA, SpeciesId.KOMMO_O],
    [TimeOfDay.DAY]: [SpeciesId.SALAMENCE, SpeciesId.GOODRA, SpeciesId.KOMMO_O],
    [TimeOfDay.DUSK]: [SpeciesId.TYRANITAR, SpeciesId.DRAGAPULT],
    [TimeOfDay.NIGHT]: [SpeciesId.TYRANITAR, SpeciesId.DRAGAPULT],
    [TimeOfDay.ALL]: [
      SpeciesId.DRAGONITE,
      SpeciesId.FLYGON,
      SpeciesId.GARCHOMP,
      SpeciesId.HAXORUS,
      SpeciesId.DRAMPA,
      SpeciesId.BAXCALIBUR,
    ],
  },
  [BiomePoolTier.BOSS_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.AERODACTYL,
      SpeciesId.DRUDDIGON,
      SpeciesId.TYRANTRUM,
      SpeciesId.DRACOZOLT,
      SpeciesId.DRACOVISH,
    ],
  },
  [BiomePoolTier.BOSS_SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.REGIDRAGO],
  },
  [BiomePoolTier.BOSS_ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.DIALGA],
  },
};

const weatherPool = {
  [WeatherType.NONE]: 1,
  [WeatherType.SUNNY]: 0,
  [WeatherType.RAIN]: 0,
  [WeatherType.SANDSTORM]: 0,
  [WeatherType.HAIL]: 0,
  [WeatherType.SNOW]: 0,
  [WeatherType.FOG]: 0,
  [WeatherType.HEAVY_RAIN]: 0,
  [WeatherType.HARSH_SUN]: 0,
  [WeatherType.STRONG_WINDS]: 0,
};

export const wastelandBiome = new Biome(
  BiomeId.WASTELAND,
  pokemonPool,
  townTrainerPool,
  weatherPool,
  townTerrainPool,
  "town",
);
