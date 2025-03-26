import type { BiomeId } from "#enums/biome-id";
import type { BiomePoolTier } from "#enums/biome-pool-tier";
import type { SpeciesId } from "#enums/species-id";
import type { TerrainType } from "#enums/terrain-type";
import type { TimeOfDay } from "#enums/time-of-day";
import type { TrainerType } from "#enums/trainer-type";
import type { WeatherType } from "#enums/weather-type";

/**
 * Calling it PEBiome for now to distinguish from Biome.ts and Biome the enum
 *
 * TODO: let's rename this Biome.ts in the future
 */
export class PEBiome {
  public biomeType: BiomeId;
  // TODO: consider `partial` and `Omit`
  public pokemonPool: Record<BiomePoolTier, Record<TimeOfDay, SpeciesId[]>>;
  public trainerPool: Record<BiomePoolTier, TrainerType[]>;
  // TODO: weatherPool and terrainPool are currently not used
  public weatherPool: Record<WeatherType, number>;
  public terrainPool: Record<TerrainType, number>;
  public bgm: string;
  // TODO: image assets should also be in here probably

  constructor(
    biomeType: BiomeId,
    pokemonPool: Record<BiomePoolTier, Record<TimeOfDay, SpeciesId[]>>,
    trainerPool: Record<BiomePoolTier, TrainerType[]>,
    weatherPool: Record<WeatherType, number>,
    terrainPool: Record<TerrainType, number>,
    bgm: string,
  ) {
    this.biomeType = biomeType;
    this.pokemonPool = pokemonPool;
    this.trainerPool = trainerPool;
    this.weatherPool = weatherPool;
    this.terrainPool = terrainPool;
    this.bgm = bgm;
  }
}
