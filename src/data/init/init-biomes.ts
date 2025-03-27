import { Biome } from "#app/data/biome";
import { caveBiome } from "#app/data/biomes/cave";
import { endBiome } from "#app/data/biomes/end";
import { townBiome, townPokemonPool, townTerrainPool, townTrainerPool, townWeatherPool } from "#app/data/biomes/town";
import { volcanoBiome } from "#app/data/biomes/volcano";
import { allBiomes } from "#app/data/data-lists";
import { BiomeId } from "#enums/biome-id";

export function initBiomes() {
  const rawAllBiomes = [
    townBiome,
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
    caveBiome,
    new Biome(BiomeId.DESERT, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.ICE_CAVE, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.MEADOW, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    new Biome(BiomeId.POWER_PLANT, townPokemonPool, townTrainerPool, townWeatherPool, townTerrainPool, "town"),
    volcanoBiome,
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
    endBiome,
  ];

  for (const pebiome of rawAllBiomes) {
    allBiomes.set(pebiome.biomeType, pebiome);
  }
}
