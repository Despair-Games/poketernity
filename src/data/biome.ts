// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import { type Arena } from "#app/field/arena";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

import type { BiomeId } from "#enums/biome-id";
import type { BiomePoolTier } from "#enums/biome-pool-tier";
import type { SpeciesId } from "#enums/species-id";
import type { TerrainType } from "#enums/terrain-type";
import type { TimeOfDay } from "#enums/time-of-day";
import type { TrainerType } from "#enums/trainer-type";
import type { WeatherType } from "#enums/weather-type";

/**
 * @todo
 * - Consider `map`, `partial` and `Omit` or an interface for `pokemonPool` and `trainerPool`
 * - Add image assets here like `biomeWithProps` (in `arena.ts`)
 * - Consider moving `mysteryEncounterByBiome` here as well
 * - Move bgm loop point here as well
 * - Move {@linkcode Arena.getTrainerChance} as well
 */
export class Biome {
  /** The corresponding biomeId enum */
  public readonly biomeId: BiomeId;
  /** A mapping of BiomePoolTier to TimeOfDay to SpeciesId representing the wild Pokemon that appear */
  public readonly pokemonPool: Record<BiomePoolTier, Record<TimeOfDay, SpeciesId[]>>;
  /** A mapping of BiomePoolTier to a list of TrainerType representing the trainers that appear */
  public readonly trainerPool: Record<BiomePoolTier, TrainerType[]>;
  /** The chance of a trainer where trainerChance is the denominator. A value of 0 means no trainer */
  public readonly trainerChance: number;
  /**
   * A mapping of {@linkcode WeatherType} to weight for what weather the biome will attempt to set upon entry
   * The chance of sun is set to 0 if it is dusk/night
   */
  public readonly weatherPool: Partial<Record<WeatherType, number>>;
  /** terrainPool is currently unused, to be implemented in a later PR */
  public readonly terrainPool: Record<TerrainType, number>;
  /** String representing the bgm of the biome */
  public readonly bgm: string;

  constructor(
    biomeId: BiomeId,
    pokemonPool: Record<BiomePoolTier, Record<TimeOfDay, SpeciesId[]>>,
    trainerPool: Record<BiomePoolTier, TrainerType[]>,
    trainerChance: number,
    weatherPool: Partial<Record<WeatherType, number>>,
    terrainPool: Record<TerrainType, number>,
    bgm: string,
  ) {
    this.biomeId = biomeId;
    this.pokemonPool = pokemonPool;
    this.trainerPool = trainerPool;
    this.trainerChance = trainerChance;
    this.weatherPool = weatherPool;
    this.terrainPool = terrainPool;
    this.bgm = bgm;
  }
}
