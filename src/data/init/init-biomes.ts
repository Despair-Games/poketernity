import { PEBiome } from "#app/data/balance/biomes/PEBiome";
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
    new PEBiome(BiomeId.TOWN, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(BiomeId.PLAINS, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(BiomeId.GRASS, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(BiomeId.TALL_GRASS, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(BiomeId.METROPOLIS, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(BiomeId.FOREST, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(BiomeId.SEA, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(BiomeId.SWAMP, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(BiomeId.BEACH, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(BiomeId.LAKE, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(BiomeId.SEABED, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(BiomeId.MOUNTAIN, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(BiomeId.BADLANDS, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(BiomeId.CAVE, cavePokemonPool, caveTrainerPool, caveWeatherPool, caveTerrainPool, "cave"),
    new PEBiome(BiomeId.DESERT, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(BiomeId.ICE_CAVE, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(BiomeId.MEADOW, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(BiomeId.POWER_PLANT, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(
      BiomeId.VOLCANO,
      volcanoPokemonPool,
      volcanoTrainerPool,
      volcanoWeatherPool,
      volcanoTerrainPool,
      "volcano",
    ),
    new PEBiome(BiomeId.GRAVEYARD, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(BiomeId.DOJO, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(BiomeId.FACTORY, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(BiomeId.RUINS, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(BiomeId.WASTELAND, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(BiomeId.ABYSS, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(BiomeId.SPACE, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(BiomeId.CONSTRUCTION_SITE, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(BiomeId.JUNGLE, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(BiomeId.FAIRY_CAVE, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(BiomeId.TEMPLE, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(BiomeId.SLUM, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(BiomeId.SNOWY_FOREST, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(BiomeId.ISLAND, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(BiomeId.LABORATORY, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(BiomeId.END, endPokemonPool, endTrainerPool, endWeatherPool, endTerrainPool, "end"),
  ];

  for (const pebiome of rawAllBiomes) {
    allBiomes.set(pebiome.biomeType, pebiome);
  }
}
