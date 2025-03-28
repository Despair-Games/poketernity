import { Biome } from "#app/data/biome";
import { townPokemonPool, townTrainerPool, townTerrainPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";
import { WeatherType } from "#enums/weather-type";

/**
 * 1/2 of Snow, 1/8 of hail
 */
const weatherPool = {
  [WeatherType.NONE]: 3,
  [WeatherType.SUNNY]: 0,
  [WeatherType.RAIN]: 0,
  [WeatherType.SANDSTORM]: 0,
  [WeatherType.HAIL]: 1,
  [WeatherType.SNOW]: 4,
  [WeatherType.FOG]: 0,
  [WeatherType.HEAVY_RAIN]: 0,
  [WeatherType.HARSH_SUN]: 0,
  [WeatherType.STRONG_WINDS]: 0,
};
export const iceCaveBiome = new Biome(
  BiomeId.ICE_CAVE,
  townPokemonPool,
  townTrainerPool,
  weatherPool,
  townTerrainPool,
  "town",
);
