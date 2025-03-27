import { Biome } from "#app/data/biome";
import { townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool } from "#app/data/biomes/town";
import { BiomeId } from "#enums/biome-id";

export const constructionSiteBiome = new Biome(
  BiomeId.CONSTRUCTION_SITE,
  townPokemonPool,
  townTrainerPool,
  townWeatherPool,
  townTerrainPool,
  "town",
);
