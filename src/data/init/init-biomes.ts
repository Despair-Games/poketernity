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
import { Biome } from "#enums/biome";

export function initBiomes() {
  const rawAllBiomes = [
    new PEBiome(Biome.TOWN, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.PLAINS, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.GRASS, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.TALL_GRASS, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.METROPOLIS, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.FOREST, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.SEA, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.SWAMP, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.BEACH, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.LAKE, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.SEABED, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.MOUNTAIN, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.BADLANDS, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.CAVE, cavePokemonPool, caveTrainerPool, caveWeatherPool, caveTerrainPool, "cave"),
    new PEBiome(Biome.DESERT, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.ICE_CAVE, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.MEADOW, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.POWER_PLANT, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(
      Biome.VOLCANO,
      volcanoPokemonPool,
      volcanoTrainerPool,
      volcanoWeatherPool,
      volcanoTerrainPool,
      "volcano",
    ),
    new PEBiome(Biome.GRAVEYARD, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.DOJO, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.FACTORY, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.RUINS, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.WASTELAND, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.ABYSS, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.SPACE, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.CONSTRUCTION_SITE, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.JUNGLE, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.FAIRY_CAVE, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.TEMPLE, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.SLUM, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.SNOWY_FOREST, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.ISLAND, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.LABORATORY, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.END, endPokemonPool, endTrainerPool, endWeatherPool, endTerrainPool, "end"),
  ];

  for (const pebiome of rawAllBiomes) {
    allBiomes.set(pebiome.biomeType, pebiome);
  }
}
