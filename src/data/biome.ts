// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import { type getRandomWeatherType } from "#app/data/weather";
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
 * - Consider `partial` and `Omit` or an interface for `pokemonPool` and `trainerPool`
 * - `weatherPool` and `terrainPool` are not used anywhere, move {@linkcode getRandomWeatherType} here
 * - Add image assets here like `biomeWithProps` (in `arena.ts`)
 * - Consider moving `mysteryEncounterByBiome` here as well
 * - Move bgm loop point here as well
 * - Move {@linkcode Arena.getTrainerChance} as well
 */
export class Biome {
  public biomeType: BiomeId;
  public pokemonPool: Record<BiomePoolTier, Record<TimeOfDay, SpeciesId[]>>;
  public trainerPool: Record<BiomePoolTier, TrainerType[]>;
  public weatherPool: Record<WeatherType, number>;
  public terrainPool: Record<TerrainType, number>;
  public bgm: string;

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
