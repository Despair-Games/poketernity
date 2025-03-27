import { Biome } from "#app/data/balance/biomes/biome";
import {
  cavePokemonPool,
  caveTrainerPool,
  caveWeatherPool,
  caveTerrainPool,
} from "#app/data/balance/biomes/PEBiome_cave";
import { endPokemonPool, endTerrainPool, endTrainerPool, endWeatherPool } from "#app/data/balance/biomes/PEBiome_end";
import {
  townPokemonPool,
  townTrainerPool,
  townWeatherPool,
  townTerrainPool,
} from "#app/data/balance/biomes/PEBiome_town";
import {
  volcanoPokemonPool,
  volcanoTrainerPool,
  volcanoWeatherPool,
  volcanoTerrainPool,
} from "#app/data/balance/biomes/PEBiome_volcano";
import { allBiomes } from "#app/data/data-lists";
import { BiomeId } from "#enums/biome-id";

export function initBiomes() {
  const rawAllBiomes = [
    new Biome(BiomeId.TOWN, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.PLAINS, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.GRASS, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.TALL_GRASS, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.METROPOLIS, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.FOREST, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.SEA, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.SWAMP, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.BEACH, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.LAKE, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.SEABED, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.MOUNTAIN, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.BADLANDS, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.CAVE, cavePokemonPool, caveTrainerPool, caveWeatherPool, caveTerrainPool, "cave"),
    new Biome(BiomeId.DESERT, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.ICE_CAVE, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.MEADOW, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.POWER_PLANT, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(
      BiomeId.VOLCANO,
      volcanoPokemonPool,
      volcanoTrainerPool,
      volcanoWeatherPool,
      volcanoTerrainPool,
      "volcano",
    ),
    new Biome(BiomeId.GRAVEYARD, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.DOJO, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.FACTORY, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.RUINS, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.WASTELAND, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.ABYSS, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.SPACE, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.CONSTRUCTION_SITE, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.JUNGLE, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.FAIRY_CAVE, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.TEMPLE, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.SLUM, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.SNOWY_FOREST, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.ISLAND, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.LABORATORY, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.END, endPokemonPool, endTrainerPool, endWeatherPool, endTerrainPool, "end"),
  ];

  for (const pebiome of rawAllBiomes) {
    allBiomes.set(pebiome.biomeType, pebiome);
  }
}
