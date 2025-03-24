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
    // The below are all filler values for now
  ];

  for (const pebiome of rawAllBiomes) {
    allBiomes.set(pebiome.biomeType, pebiome);
  }
}
