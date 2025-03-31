import { Biome } from "#app/data/biome";
import { townTrainerPool, townWeatherPool, townTerrainPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { BiomePoolTier } from "#enums/biome-pool-tier";
import { SpeciesId } from "#enums/species-id";
import { TimeOfDay } from "#enums/time-of-day";

const pokemonPool = {
  [BiomePoolTier.COMMON]: {
    [TimeOfDay.DAWN]: [SpeciesId.LEDYBA, SpeciesId.BUDEW, SpeciesId.COTTONEE, SpeciesId.MINCCINO],
    [TimeOfDay.DAY]: [SpeciesId.BUDEW, SpeciesId.COTTONEE, SpeciesId.MINCCINO],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      { 1: [SpeciesId.BLITZLE], 27: [SpeciesId.ZEBSTRIKA] },
      { 1: [SpeciesId.FLABEBE], 19: [SpeciesId.FLOETTE] },
      { 1: [SpeciesId.CUTIEFLY], 25: [SpeciesId.RIBOMBEE] },
      { 1: [SpeciesId.GOSSIFLEUR], 20: [SpeciesId.ELDEGOSS] },
      { 1: [SpeciesId.WOOLOO], 24: [SpeciesId.DUBWOOL] },
    ],
  },
  [BiomePoolTier.UNCOMMON]: {
    [TimeOfDay.DAWN]: [
      { 1: [SpeciesId.PONYTA], 40: [SpeciesId.RAPIDASH] },
      { 1: [SpeciesId.SNUBBULL], 23: [SpeciesId.GRANBULL] },
      { 1: [SpeciesId.SKITTY], 30: [SpeciesId.DELCATTY] },
      SpeciesId.BOUFFALANT,
      { 1: [SpeciesId.SMOLIV], 25: [SpeciesId.DOLLIV], 35: [SpeciesId.ARBOLIVA] },
    ],
    [TimeOfDay.DAY]: [
      { 1: [SpeciesId.PONYTA], 40: [SpeciesId.RAPIDASH] },
      { 1: [SpeciesId.SNUBBULL], 23: [SpeciesId.GRANBULL] },
      { 1: [SpeciesId.SKITTY], 30: [SpeciesId.DELCATTY] },
      SpeciesId.BOUFFALANT,
      { 1: [SpeciesId.SMOLIV], 25: [SpeciesId.DOLLIV], 35: [SpeciesId.ARBOLIVA] },
    ],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      { 1: [SpeciesId.JIGGLYPUFF], 30: [SpeciesId.WIGGLYTUFF] },
      { 1: [SpeciesId.MAREEP], 15: [SpeciesId.FLAAFFY], 30: [SpeciesId.AMPHAROS] },
      { 1: [SpeciesId.RALTS], 20: [SpeciesId.KIRLIA], 30: [SpeciesId.GARDEVOIR] },
      { 1: [SpeciesId.GLAMEOW], 38: [SpeciesId.PURUGLY] },
      SpeciesId.ORICORIO,
    ],
  },
  [BiomePoolTier.RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [SpeciesId.VOLBEAT, SpeciesId.ILLUMISE],
    [TimeOfDay.ALL]: [
      SpeciesId.TAUROS,
      SpeciesId.EEVEE,
      SpeciesId.MILTANK,
      SpeciesId.SPINDA,
      { 1: [SpeciesId.APPLIN], 30: [SpeciesId.DIPPLIN] },
      { 1: [SpeciesId.SPRIGATITO], 16: [SpeciesId.FLORAGATO], 36: [SpeciesId.MEOWSCARADA] },
    ],
  },
  [BiomePoolTier.SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.CHANSEY, SpeciesId.SYLVEON],
  },
  [BiomePoolTier.ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.MELOETTA],
  },
  [BiomePoolTier.BOSS]: {
    [TimeOfDay.DAWN]: [
      SpeciesId.LEDIAN,
      SpeciesId.GRANBULL,
      SpeciesId.DELCATTY,
      SpeciesId.ROSERADE,
      SpeciesId.CINCCINO,
      SpeciesId.BOUFFALANT,
      SpeciesId.ARBOLIVA,
    ],
    [TimeOfDay.DAY]: [
      SpeciesId.GRANBULL,
      SpeciesId.DELCATTY,
      SpeciesId.ROSERADE,
      SpeciesId.CINCCINO,
      SpeciesId.BOUFFALANT,
      SpeciesId.ARBOLIVA,
    ],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.TAUROS,
      SpeciesId.MILTANK,
      SpeciesId.GARDEVOIR,
      SpeciesId.PURUGLY,
      SpeciesId.ZEBSTRIKA,
      SpeciesId.FLORGES,
      SpeciesId.RIBOMBEE,
      SpeciesId.DUBWOOL,
    ],
  },
  [BiomePoolTier.BOSS_RARE]: {
    [TimeOfDay.DAWN]: [SpeciesId.HISUI_LILLIGANT],
    [TimeOfDay.DAY]: [SpeciesId.HISUI_LILLIGANT],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.BLISSEY,
      SpeciesId.SYLVEON,
      SpeciesId.FLAPPLE,
      SpeciesId.APPLETUN,
      SpeciesId.MEOWSCARADA,
      SpeciesId.HYDRAPPLE,
    ],
  },
  [BiomePoolTier.BOSS_SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.MELOETTA],
  },
  [BiomePoolTier.BOSS_ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.SHAYMIN],
  },
};

export const meadowBiome = new Biome(
  BiomeId.MEADOW,
  pokemonPool,
  townTrainerPool,
  townWeatherPool,
  townTerrainPool,
  "town",
);
