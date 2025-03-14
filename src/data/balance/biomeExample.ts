import {
  biomeExample1OutgoingLinks,
  biomeExample1pokemonPool,
  biomeExample1terrainPool,
  biomeExample1trainerPool,
  biomeExample1weatherPool,
} from "#app/data/balance/biomeExample1";
import { Biome } from "#enums/biome";
import type { BiomePoolTier } from "#enums/biome-pool-tier";
import type { Species } from "#enums/species";
import type { TerrainType } from "#enums/terrain-type";
import type { TimeOfDay } from "#enums/time-of-day";
import type { TrainerType } from "#enums/trainer-type";
import type { WeatherType } from "#enums/weather-type";

export class BiomeClassExample {
  public biomeType: Biome;
  // TODO: consider `partial` and `Omit`
  public pokemonPool: Record<BiomePoolTier, Record<TimeOfDay, Species[]>>;
  public trainerPool: Record<BiomePoolTier, TrainerType[]>;
  public weatherPool: Record<WeatherType, number>;
  public terrainPool: Record<TerrainType, number>;
  public outgoingPaths: Partial<Record<Biome, number>>;

  constructor(
    biomeType: Biome,
    pokemonPool: Record<BiomePoolTier, Record<TimeOfDay, Species[]>>,
    trainerPool: Record<BiomePoolTier, TrainerType[]>,
    weatherPool: Record<WeatherType, number>,
    terrainPool: Record<TerrainType, number>,
    outgoingPaths: Partial<Record<Biome, number>>,
  ) {
    this.biomeType = biomeType;
    this.pokemonPool = pokemonPool;
    this.trainerPool = trainerPool;
    this.weatherPool = weatherPool;
    this.terrainPool = terrainPool;
    this.outgoingPaths = outgoingPaths;
  }
}

// Do this in its own file
export const allNewBiomes = [
  new BiomeClassExample(
    Biome.END,
    biomeExample1pokemonPool,
    biomeExample1trainerPool,
    biomeExample1weatherPool,
    biomeExample1terrainPool,
    biomeExample1OutgoingLinks,
  ),
];
