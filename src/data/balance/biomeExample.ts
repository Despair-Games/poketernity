import type { Biome } from "#enums/biome";
import { BiomePoolTier } from "#enums/biome-pool-tier";
import { Species } from "#enums/species";
import { TerrainType } from "#enums/terrain-type";
import { TimeOfDay } from "#enums/time-of-day";
import { TrainerType } from "#enums/trainer-type";
import { WeatherType } from "#enums/weather-type";

export class BiomeClassExample {
  public biomeType: Biome;
  // TODO: consider `partial` and `Omit`
  public pokemonPool: Record<BiomePoolTier, Record<TimeOfDay, Species[]>>;
  public trainerPool: Record<BiomePoolTier, TrainerType[]>;
  public weatherPool: Record<WeatherType, number>;
  public terrainPool: Record<TerrainType, number>;
  /** Should biomeLinks also go here instead of a single biomeLinks? */
  // public outGoingPaths: Partial<Biome, number>;

  constructor() {}
}

/** Example Biome class that lives in its own file
 *
 * Someone can just copy/paste this to make a new biome
 */
export class biomeExample1 extends BiomeClassExample {
  constructor() {
    super();
    this.pokemonPool = {
      [BiomePoolTier.COMMON]: {
        [TimeOfDay.DAWN]: [Species.CHIKORITA],
        [TimeOfDay.DAY]: [Species.CYNDAQUIL],
        [TimeOfDay.DUSK]: [Species.TOTODILE],
        [TimeOfDay.NIGHT]: [Species.HOOTHOOT],
        // Instead of a TimeofDay.ALL, should these just be in the other TimeOfDays' lists?
        [TimeOfDay.ALL]: [Species.SENTRET],
      },
      [BiomePoolTier.UNCOMMON]: {
        [TimeOfDay.DAWN]: [Species.CHIKORITA],
        [TimeOfDay.DAY]: [Species.CYNDAQUIL],
        [TimeOfDay.DUSK]: [Species.TOTODILE],
        [TimeOfDay.NIGHT]: [Species.HOOTHOOT],
        [TimeOfDay.ALL]: [Species.SENTRET],
      },
      [BiomePoolTier.RARE]: {
        [TimeOfDay.DAWN]: [Species.CHIKORITA],
        [TimeOfDay.DAY]: [Species.CYNDAQUIL],
        [TimeOfDay.DUSK]: [Species.TOTODILE],
        [TimeOfDay.NIGHT]: [Species.HOOTHOOT],
        [TimeOfDay.ALL]: [Species.SENTRET],
      },
      [BiomePoolTier.SUPER_RARE]: {
        [TimeOfDay.DAWN]: [Species.CHIKORITA],
        [TimeOfDay.DAY]: [Species.CYNDAQUIL],
        [TimeOfDay.DUSK]: [Species.TOTODILE],
        [TimeOfDay.NIGHT]: [Species.HOOTHOOT],
        [TimeOfDay.ALL]: [Species.SENTRET],
      },
      [BiomePoolTier.ULTRA_RARE]: {
        [TimeOfDay.DAWN]: [Species.CHIKORITA],
        [TimeOfDay.DAY]: [Species.CYNDAQUIL],
        [TimeOfDay.DUSK]: [Species.TOTODILE],
        [TimeOfDay.NIGHT]: [Species.HOOTHOOT],
        [TimeOfDay.ALL]: [Species.SENTRET],
      },
      [BiomePoolTier.BOSS]: {
        [TimeOfDay.DAWN]: [Species.CHIKORITA],
        [TimeOfDay.DAY]: [Species.CYNDAQUIL],
        [TimeOfDay.DUSK]: [Species.TOTODILE],
        [TimeOfDay.NIGHT]: [Species.HOOTHOOT],
        [TimeOfDay.ALL]: [Species.SENTRET],
      },
      [BiomePoolTier.BOSS_RARE]: {
        [TimeOfDay.DAWN]: [Species.CHIKORITA],
        [TimeOfDay.DAY]: [Species.CYNDAQUIL],
        [TimeOfDay.DUSK]: [Species.TOTODILE],
        [TimeOfDay.NIGHT]: [Species.HOOTHOOT],
        [TimeOfDay.ALL]: [Species.SENTRET],
      },
      [BiomePoolTier.BOSS_SUPER_RARE]: {
        [TimeOfDay.DAWN]: [Species.CHIKORITA],
        [TimeOfDay.DAY]: [Species.CYNDAQUIL],
        [TimeOfDay.DUSK]: [Species.TOTODILE],
        [TimeOfDay.NIGHT]: [Species.HOOTHOOT],
        [TimeOfDay.ALL]: [Species.SENTRET],
      },
      [BiomePoolTier.BOSS_ULTRA_RARE]: {
        [TimeOfDay.DAWN]: [Species.CHIKORITA],
        [TimeOfDay.DAY]: [Species.CYNDAQUIL],
        [TimeOfDay.DUSK]: [Species.TOTODILE],
        [TimeOfDay.NIGHT]: [Species.HOOTHOOT],
        [TimeOfDay.ALL]: [Species.SENTRET],
      },
    };

    this.trainerPool = {
      [BiomePoolTier.COMMON]: [TrainerType.YOUNGSTER],
      [BiomePoolTier.UNCOMMON]: [],
      [BiomePoolTier.RARE]: [],
      [BiomePoolTier.SUPER_RARE]: [],
      [BiomePoolTier.ULTRA_RARE]: [],
      [BiomePoolTier.BOSS]: [TrainerType.BROCK],
      [BiomePoolTier.BOSS_RARE]: [],
      [BiomePoolTier.BOSS_SUPER_RARE]: [],
      [BiomePoolTier.BOSS_ULTRA_RARE]: [],
    };

    this.weatherPool = {
      [WeatherType.NONE]: 1,
      [WeatherType.SUNNY]: 1,
      [WeatherType.RAIN]: 0,
      [WeatherType.SANDSTORM]: 0,
      [WeatherType.HAIL]: 0,
      [WeatherType.SNOW]: 0,
      [WeatherType.FOG]: 0,
      [WeatherType.HEAVY_RAIN]: 0,
      [WeatherType.HARSH_SUN]: 1,
      [WeatherType.STRONG_WINDS]: 0,
    };

    this.terrainPool = {
      [TerrainType.NONE]: 99,
      [TerrainType.MISTY]: 1,
      [TerrainType.ELECTRIC]: 0,
      [TerrainType.GRASSY]: 0,
      [TerrainType.PSYCHIC]: 0,
    };
  }
}
