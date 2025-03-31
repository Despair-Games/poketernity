import { Biome } from "#app/data/biome";
import { townPokemonPool, townTrainerPool, townTerrainPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { WeatherType } from "#enums/weather-type";

/** 30% of sun if dawn or day, none otherwise */
const weatherPool = {
  [WeatherType.NONE]: 7,
  [WeatherType.SUNNY]: 3,
  [WeatherType.RAIN]: 0,
  [WeatherType.SANDSTORM]: 0,
  [WeatherType.HAIL]: 0,
  [WeatherType.SNOW]: 0,
  [WeatherType.FOG]: 0,
  [WeatherType.HEAVY_RAIN]: 0,
  [WeatherType.HARSH_SUN]: 0,
  [WeatherType.STRONG_WINDS]: 0,
};

export const grassBiome = new Biome(
  BiomeId.GRASS,
  townPokemonPool,
  townTrainerPool,
  weatherPool,
  townTerrainPool,
  "town",
);
