import { Biome } from "#app/data/biome";
import { townPokemonPool, townTrainerPool, townTerrainPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";

import { WeatherType } from "#enums/weather-type";

const weatherPool = {
  [WeatherType.NONE]: 3,
  [WeatherType.SUNNY]: 0,
  [WeatherType.RAIN]: 4,
  [WeatherType.SANDSTORM]: 0,
  [WeatherType.HAIL]: 0,
  [WeatherType.SNOW]: 0,
  [WeatherType.FOG]: 1,
  [WeatherType.HEAVY_RAIN]: 0,
  [WeatherType.HARSH_SUN]: 0,
  [WeatherType.STRONG_WINDS]: 0,
};

export const swampBiome = new Biome(
  BiomeId.SWAMP,
  townPokemonPool,
  townTrainerPool,
  weatherPool,
  townTerrainPool,
  "town",
);
