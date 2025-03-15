import { Biome } from "#enums/biome";
import type { BiomePoolTier } from "#enums/biome-pool-tier";
import type { Species } from "#enums/species";
import type { TerrainType } from "#enums/terrain-type";
import type { TimeOfDay } from "#enums/time-of-day";
import type { TrainerType } from "#enums/trainer-type";
import type { WeatherType } from "#enums/weather-type";

/**
 * Calling it PEBiome for now to distinguish from Biome.ts and Biome the enum
 */
export class PEBiome {
  public biomeType: Biome;
  // TODO: consider `partial` and `Omit`
  public pokemonPool: Record<BiomePoolTier, Record<TimeOfDay, Species[]>>;
  public trainerPool: Record<BiomePoolTier, TrainerType[]>;
  public weatherPool: Record<WeatherType, number>;
  public terrainPool: Record<TerrainType, number>;
  public outgoingPaths: Partial<Record<Biome, number>>;
  public bgm: string;

  constructor(
    biomeType: Biome,
    pokemonPool: Record<BiomePoolTier, Record<TimeOfDay, Species[]>>,
    trainerPool: Record<BiomePoolTier, TrainerType[]>,
    weatherPool: Record<WeatherType, number>,
    terrainPool: Record<TerrainType, number>,
    outgoingPaths: Partial<Record<Biome, number>>,
    bgm: string,
  ) {
    this.biomeType = biomeType;
    this.pokemonPool = pokemonPool;
    this.trainerPool = trainerPool;
    this.weatherPool = weatherPool;
    this.terrainPool = terrainPool;
    this.outgoingPaths = outgoingPaths;
    this.bgm = bgm;
  }

  getNextBiome() {
    // TODO: calculate the next biome to go to based off outgoingPaths
    return Biome.TOWN;
  }
}
