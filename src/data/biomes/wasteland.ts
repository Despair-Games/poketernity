import { Biome } from "#app/data/biome";
import { townTrainerPool, townWeatherPool, townTerrainPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { BiomePoolTier } from "#enums/biome-pool-tier";
import { SpeciesId } from "#enums/species-id";
import { TimeOfDay } from "#enums/time-of-day";

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

export const wastelandBiome = new Biome(
  BiomeId.WASTELAND,
  pokemonPool,
  townTrainerPool,
  townWeatherPool,
  townTerrainPool,
  "town",
);
