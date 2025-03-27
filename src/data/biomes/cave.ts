import { Biome } from "#app/data/biome";
import { BiomeId } from "#enums/biome-id";
import { BiomePoolTier } from "#enums/biome-pool-tier";
import { SpeciesId } from "#enums/species-id";
import { TerrainType } from "#enums/terrain-type";
import { TimeOfDay } from "#enums/time-of-day";
import { TrainerType } from "#enums/trainer-type";
import { WeatherType } from "#enums/weather-type";

/**
 * This file represents all the data of the cave biome
 */
<<<<<<<< HEAD:src/data/biomes/cave.ts
const pokemonPool = {
========
export const cavePokemonPool = {
>>>>>>>> 8c5ce978bb84c6e24b5fa5b9768d513a39aabc90:src/data/balance/biomes/cave.ts
  [BiomePoolTier.COMMON]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.ZUBAT,
      SpeciesId.PARAS,
      SpeciesId.TEDDIURSA,
      SpeciesId.WHISMUR,
      SpeciesId.ROGGENROLA,
      SpeciesId.WOOBAT,
      SpeciesId.DIGGERSBY,
      SpeciesId.NACLI,
    ],
  },
  [BiomePoolTier.UNCOMMON]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [SpeciesId.ROCKRUFF],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.GEODUDE, SpeciesId.MAKUHITA, SpeciesId.NOSEPASS, SpeciesId.NOIBAT, SpeciesId.WIMPOD],
  },
  [BiomePoolTier.RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.ONIX, SpeciesId.FERROSEED, SpeciesId.CARBINK, SpeciesId.GLIMMET],
  },
  [BiomePoolTier.SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.SHUCKLE],
  },
  [BiomePoolTier.ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.UXIE],
  },
  [BiomePoolTier.BOSS]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [
      SpeciesId.PARASECT,
      SpeciesId.ONIX,
      SpeciesId.CROBAT,
      SpeciesId.URSARING,
      SpeciesId.EXPLOUD,
      SpeciesId.PROBOPASS,
      SpeciesId.GIGALITH,
      SpeciesId.SWOOBAT,
      SpeciesId.DIGGERSBY,
      SpeciesId.NOIVERN,
      SpeciesId.GOLISOPOD,
      SpeciesId.GARGANACL,
    ],
  },
  [BiomePoolTier.BOSS_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [SpeciesId.LYCANROC],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.SHUCKLE, SpeciesId.FERROTHORN, SpeciesId.GLIMMORA],
  },
  [BiomePoolTier.BOSS_SUPER_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.UXIE],
  },
  [BiomePoolTier.BOSS_ULTRA_RARE]: {
    [TimeOfDay.DAWN]: [],
    [TimeOfDay.DAY]: [],
    [TimeOfDay.DUSK]: [],
    [TimeOfDay.NIGHT]: [],
    [TimeOfDay.ALL]: [SpeciesId.TERAPAGOS],
  },
};

<<<<<<<< HEAD:src/data/biomes/cave.ts
const trainerPool = {
========
export const caveTrainerPool = {
>>>>>>>> 8c5ce978bb84c6e24b5fa5b9768d513a39aabc90:src/data/balance/biomes/cave.ts
  [BiomePoolTier.COMMON]: [TrainerType.BACKPACKER, TrainerType.HIKER],
  [BiomePoolTier.UNCOMMON]: [TrainerType.ACE_TRAINER, TrainerType.BLACK_BELT],
  [BiomePoolTier.RARE]: [],
  [BiomePoolTier.SUPER_RARE]: [],
  [BiomePoolTier.ULTRA_RARE]: [],
  [BiomePoolTier.BOSS]: [TrainerType.BROCK, TrainerType.ROXANNE, TrainerType.ROARK],
  [BiomePoolTier.BOSS_RARE]: [],
  [BiomePoolTier.BOSS_SUPER_RARE]: [],
  [BiomePoolTier.BOSS_ULTRA_RARE]: [],
};

<<<<<<<< HEAD:src/data/biomes/cave.ts
const weatherPool = {
========
export const caveWeatherPool = {
>>>>>>>> 8c5ce978bb84c6e24b5fa5b9768d513a39aabc90:src/data/balance/biomes/cave.ts
  [WeatherType.NONE]: 1,
  [WeatherType.SUNNY]: 0,
  [WeatherType.RAIN]: 0,
  [WeatherType.SANDSTORM]: 0,
  [WeatherType.HAIL]: 0,
  [WeatherType.SNOW]: 0,
  [WeatherType.FOG]: 0,
  [WeatherType.HEAVY_RAIN]: 0,
  [WeatherType.HARSH_SUN]: 1,
  [WeatherType.STRONG_WINDS]: 0,
};

<<<<<<<< HEAD:src/data/biomes/cave.ts
const terrainPool = {
========
export const caveTerrainPool = {
>>>>>>>> 8c5ce978bb84c6e24b5fa5b9768d513a39aabc90:src/data/balance/biomes/cave.ts
  [TerrainType.NONE]: 1,
  [TerrainType.MISTY]: 0,
  [TerrainType.ELECTRIC]: 0,
  [TerrainType.GRASSY]: 0,
  [TerrainType.PSYCHIC]: 0,
};

export const caveBiome = new Biome(BiomeId.CAVE, pokemonPool, trainerPool, weatherPool, terrainPool, "cave");
