import { PEBiome } from "#app/data/balance/biomes/PEBiome";
import {
  cavePokemonPool,
  caveTrainerPool,
  caveWeatherPool,
  caveTerrainPool,
} from "#app/data/balance/biomes/PEBiome_cave";
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
    new PEBiome(
      Biome.VOLCANO,
      volcanoPokemonPool,
      volcanoTrainerPool,
      volcanoWeatherPool,
      volcanoTerrainPool,
      "volcano",
    ),
    new PEBiome(Biome.CAVE, cavePokemonPool, caveTrainerPool, caveWeatherPool, caveTerrainPool, "cave"),
    // The below are all filler values for now, used in certain unit tests
    new PEBiome(Biome.MOUNTAIN, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "TOWN"),
    new PEBiome(Biome.LAKE, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.ICE_CAVE, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.SNOWY_FOREST, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.END, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.GRASS, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.CAVE, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.PLAINS, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.SPACE, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.SEA, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.SWAMP, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.JUNGLE, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.LABORATORY, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.FAIRY_CAVE, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new PEBiome(Biome.WASTELAND, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
  ];

  for (const pebiome of rawAllBiomes) {
    allBiomes.set(pebiome.biomeType, pebiome);
  }
}
