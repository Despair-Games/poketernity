import { Biome } from "#app/data/biome";
import { townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";

export const badlandsBiome = new Biome(
  BiomeId.BADLANDS,
  townPokemonPool,
  townTrainerPool,
  townWeatherPool,
  townTerrainPool,
  "town",
);
