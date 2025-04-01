import { Biome } from "#app/data/biome";
import { townTrainerPool, townWeatherPool, townTerrainPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { BiomePoolTier } from "#enums/biome-pool-tier";
import { SpeciesId } from "#enums/species-id";
import { TimeOfDay } from "#enums/time-of-day";

const pokemonPool = {
  [BiomePoolTier.COMMON]: {
    [TimeOfDay.DAWN]: [SpeciesId.WOOPER, SpeciesId.LOTAD],
    [TimeOfDay.DAY]: [SpeciesId.WOOPER, SpeciesId.LOTAD],
    [TimeOfDay.DUSK]: [SpeciesId.EKANS, SpeciesId.PALDEA_WOOPER],
    [TimeOfDay.NIGHT]: [SpeciesId.EKANS, SpeciesId.PALDEA_WOOPER],
    [TimeOfDay.ALL]: [SpeciesId.POLIWAG, SpeciesId.GULPIN, SpeciesId.SHELLOS, SpeciesId.TYMPOLE],
  },
  [BiomePoolTier.UNCOMMON]: {
    [TimeOfDay.DAWN]: [SpeciesId.EKANS],
    [TimeOfDay.DAY]: [SpeciesId.EKANS],
    [TimeOfDay.DUSK]: [SpeciesId.CROAGUNK],
    [TimeOfDay.NIGHT]: [SpeciesId.CROAGUNK],
    [TimeOfDay.ALL]: [SpeciesId.PSYDUCK, SpeciesId.BARBOACH, SpeciesId.SKORUPI, SpeciesId.STUNFISK, SpeciesId.MAREANIE],
  },
  [BiomePoolTier.RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.TOTODILE, SpeciesId.MUDKIP],
  },
  [BiomePoolTier.SUPER_RARE]: {
    [TimeOfDay.DAWN]: [SpeciesId.GALAR_SLOWPOKE, SpeciesId.HISUI_SLIGGOO],
    [TimeOfDay.DAY]: [SpeciesId.GALAR_SLOWPOKE, SpeciesId.HISUI_SLIGGOO],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.POLITOED, SpeciesId.GALAR_STUNFISK],
  },
  [BiomePoolTier.ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.AZELF, SpeciesId.POIPOLE],
  },
  [BiomePoolTier.BOSS]: {
    [TimeOfDay.DAWN]: [SpeciesId.QUAGSIRE, SpeciesId.LUDICOLO],
    [TimeOfDay.DAY]: [SpeciesId.QUAGSIRE, SpeciesId.LUDICOLO],
    [TimeOfDay.DUSK]: [SpeciesId.ARBOK, SpeciesId.CLODSIRE],
    [TimeOfDay.NIGHT]: [SpeciesId.ARBOK, SpeciesId.CLODSIRE],
    [TimeOfDay.ALL]: [
      SpeciesId.POLIWRATH,
      SpeciesId.SWALOT,
      SpeciesId.WHISCASH,
      SpeciesId.GASTRODON,
      SpeciesId.SEISMITOAD,
      SpeciesId.STUNFISK,
      SpeciesId.TOXAPEX,
    ],
  },
  [BiomePoolTier.BOSS_RARE]: {
    [TimeOfDay.DAWN]: [SpeciesId.GALAR_SLOWBRO, SpeciesId.GALAR_SLOWKING, SpeciesId.HISUI_GOODRA],
    [TimeOfDay.DAY]: [SpeciesId.GALAR_SLOWBRO, SpeciesId.GALAR_SLOWKING, SpeciesId.HISUI_GOODRA],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.FERALIGATR, SpeciesId.POLITOED, SpeciesId.SWAMPERT, SpeciesId.GALAR_STUNFISK],
  },
  [BiomePoolTier.BOSS_SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.AZELF, SpeciesId.NAGANADEL],
  },
  [BiomePoolTier.BOSS_ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [],
  },
};

export const swampBiome = new Biome(
  BiomeId.SWAMP,
  pokemonPool,
  townTrainerPool,
  townWeatherPool,
  townTerrainPool,
  "town",
);
