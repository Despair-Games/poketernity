import { Biome } from "#enums/biome";
import { WeatherType } from "#enums/weather-type";
import { getPokemonNameWithAffix } from "../messages";
import type Pokemon from "../field/pokemon";
import { Type } from "#enums/type";
import type Move from "./move";
import { AttackMove } from "./move";
import { randSeedInt } from "#app/utils";
import { SuppressWeatherEffectAbAttr } from "./ability";
import i18next from "i18next";
import { globalScene } from "#app/global-scene";

/**
 * Class representing Weather effects
 * @var weatherType - The WeatherType that is being represented
 * @var turnsLeft - How many turns the weather still has left (0 if immutable)
 */
export class Weather {
  public weatherType: WeatherType;
  public turnsLeft: number;

  constructor(weatherType: WeatherType, turnsLeft?: number) {
    this.weatherType = weatherType;
    this.turnsLeft = !this.isImmutable() ? turnsLeft || 0 : 0;
  }

  /**
   * Decrements turnsLeft by 1
   * @returns false if turnsLeft is set to 0. True otherwise
   */
  lapse(): boolean {
    if (this.isImmutable()) {
      return true;
    }
    if (this.turnsLeft) {
      return !!--this.turnsLeft;
    }

    return true;
  }

  /**
   * Checks if the weather is immutable (heavy rain, harsh sun, or strong winds)
   * @returns true if WeatherType is immutable, false otherwise
   */
  isImmutable(): boolean {
    switch (this.weatherType) {
      case WeatherType.HEAVY_RAIN:
      case WeatherType.HARSH_SUN:
      case WeatherType.STRONG_WINDS:
        return true;
    }

    return false;
  }

  /**
   * Checks if the weather deals damage
   * @returns true for sandstorm or hail, false otherwise
   */
  isDamaging(): boolean {
    switch (this.weatherType) {
      case WeatherType.SANDSTORM:
      case WeatherType.HAIL:
        return true;
    }

    return false;
  }

  /**
   * Checks if the weather will deal damage to a type
   * Rock/Ground/Steel types are immune to sandstorm
   * Ice is immune to hail
   * @param type - the type of the Pokemon being checked
   * @returns true if damage will be dealt, false otherwise
   */
  isTypeDamageImmune(type: Type): boolean {
    switch (this.weatherType) {
      case WeatherType.SANDSTORM:
        return type === Type.GROUND || type === Type.ROCK || type === Type.STEEL;
      case WeatherType.HAIL:
        return type === Type.ICE;
    }

    return false;
  }

  /**
   * Function to return a multiplier for specific types
   * Harsh/normal sun boosts fire by 50% and reduces water by 50%
   * Heavy/normal rain boosts water by 50% and reduces fire by 50%
   * @param attackType - the type being checked
   * @returns a multiplier (0.5, 1.5, or 1)
   */
  getAttackTypeMultiplier(attackType: Type): number {
    switch (this.weatherType) {
      case WeatherType.SUNNY:
      case WeatherType.HARSH_SUN:
        if (attackType === Type.FIRE) {
          return 1.5;
        }
        if (attackType === Type.WATER) {
          return 0.5;
        }
        break;
      case WeatherType.RAIN:
      case WeatherType.HEAVY_RAIN:
        if (attackType === Type.FIRE) {
          return 0.5;
        }
        if (attackType === Type.WATER) {
          return 1.5;
        }
        break;
    }

    return 1;
  }

  /**
   * Checks if the weather should cancel the move
   * Harsh sun cancels out water attacks
   * Heavy rain cancels out fire attacks
   * @param user - The Pokemon using the move
   * @param move - The Move
   * @returns true if the move is cancelled by the weather, false otherwise
   */
  isMoveWeatherCancelled(user: Pokemon, move: Move): boolean {
    const moveType = user.getMoveType(move);

    switch (this.weatherType) {
      case WeatherType.HARSH_SUN:
        return move instanceof AttackMove && moveType === Type.WATER;
      case WeatherType.HEAVY_RAIN:
        return move instanceof AttackMove && moveType === Type.FIRE;
    }

    return false;
  }

  /**
   * Checks if the weather would be suppressed by a Pokemon with an ability/passive
   * with SuppressWeatherEffectAbAttr (Air Lock or Cloud Nine)
   * @returns true if the weather is being suppressed, false otherwise
   */
  isEffectSuppressed(): boolean {
    const field = globalScene.getField(true);

    for (const pokemon of field) {
      let suppressWeatherEffectAbAttr: SuppressWeatherEffectAbAttr | null = pokemon
        .getAbility()
        .getAttrs(SuppressWeatherEffectAbAttr)[0];
      if (!suppressWeatherEffectAbAttr) {
        suppressWeatherEffectAbAttr = pokemon.hasPassive()
          ? pokemon.getPassiveAbility().getAttrs(SuppressWeatherEffectAbAttr)[0]
          : null;
      }
      if (suppressWeatherEffectAbAttr && (!this.isImmutable() || suppressWeatherEffectAbAttr.affectsImmutable)) {
        return true;
      }
    }

    return false;
  }
}

// TODO: Should localization return null or "" as a default? Inconsistencies in the codebase

/**
 * Function to get the starting message for weather
 * @param weatherType - the WeatherType starting
 * @returns the associated string
 */
export function getWeatherStartMessage(weatherType: WeatherType): string | null {
  switch (weatherType) {
    case WeatherType.SUNNY:
      return i18next.t("weather:sunnyStartMessage");
    case WeatherType.RAIN:
      return i18next.t("weather:rainStartMessage");
    case WeatherType.SANDSTORM:
      return i18next.t("weather:sandstormStartMessage");
    case WeatherType.HAIL:
      return i18next.t("weather:hailStartMessage");
    case WeatherType.SNOW:
      return i18next.t("weather:snowStartMessage");
    case WeatherType.FOG:
      return i18next.t("weather:fogStartMessage");
    case WeatherType.HEAVY_RAIN:
      return i18next.t("weather:heavyRainStartMessage");
    case WeatherType.HARSH_SUN:
      return i18next.t("weather:harshSunStartMessage");
    case WeatherType.STRONG_WINDS:
      return i18next.t("weather:strongWindsStartMessage");
  }

  return null;
}

/**
 * Function to get the lapsing message for weather
 * @param weatherType - the WeatherType lapsing
 * @returns the associated string
 */
export function getWeatherLapseMessage(weatherType: WeatherType): string | null {
  switch (weatherType) {
    case WeatherType.SUNNY:
      return i18next.t("weather:sunnyLapseMessage");
    case WeatherType.RAIN:
      return i18next.t("weather:rainLapseMessage");
    case WeatherType.SANDSTORM:
      return i18next.t("weather:sandstormLapseMessage");
    case WeatherType.HAIL:
      return i18next.t("weather:hailLapseMessage");
    case WeatherType.SNOW:
      return i18next.t("weather:snowLapseMessage");
    case WeatherType.FOG:
      return i18next.t("weather:fogLapseMessage");
    case WeatherType.HEAVY_RAIN:
      return i18next.t("weather:heavyRainLapseMessage");
    case WeatherType.HARSH_SUN:
      return i18next.t("weather:harshSunLapseMessage");
    case WeatherType.STRONG_WINDS:
      return i18next.t("weather:strongWindsLapseMessage");
  }

  return null;
}

/**
 * Function to get the associated message for when a Pokemon is damaged by weather (sandstorm or hail)
 * @param weatherType - The weather
 * @param pokemon - The Pokemon being damaged
 * @returns the corresponding string
 */
export function getWeatherDamageMessage(weatherType: WeatherType, pokemon: Pokemon): string | null {
  switch (weatherType) {
    case WeatherType.SANDSTORM:
      return i18next.t("weather:sandstormDamageMessage", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) });
    case WeatherType.HAIL:
      return i18next.t("weather:hailDamageMessage", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) });
  }

  return null;
}

/**
 * Function to get the ending message for weather
 * @param weatherType - the WeatherType ending
 * @returns the associated string
 */
export function getWeatherClearMessage(weatherType: WeatherType): string | null {
  switch (weatherType) {
    case WeatherType.SUNNY:
      return i18next.t("weather:sunnyClearMessage");
    case WeatherType.RAIN:
      return i18next.t("weather:rainClearMessage");
    case WeatherType.SANDSTORM:
      return i18next.t("weather:sandstormClearMessage");
    case WeatherType.HAIL:
      return i18next.t("weather:hailClearMessage");
    case WeatherType.SNOW:
      return i18next.t("weather:snowClearMessage");
    case WeatherType.FOG:
      return i18next.t("weather:fogClearMessage");
    case WeatherType.HEAVY_RAIN:
      return i18next.t("weather:heavyRainClearMessage");
    case WeatherType.HARSH_SUN:
      return i18next.t("weather:harshSunClearMessage");
    case WeatherType.STRONG_WINDS:
      return i18next.t("weather:strongWindsClearMessage");
  }

  return null;
}

/**
 * A mapping of weather type to weight
 */
interface WeatherPoolEntry {
  weatherType: WeatherType;
  weight: number;
}

/**
 * Gets a random weather type for an arena's biome
 * Each biome has their own weighted weather distribution
 * TODO: the biome specific weather pools should probably be moved into either biome.ts or a balance/ file
 * @param arena - The associated arena
 * @returns the WeatherType, WeatherType.NONE if no weather
 */
export function getRandomWeatherType(arena: any /* Importing from arena causes a circular dependency */): WeatherType {
  let weatherPool: WeatherPoolEntry[] = [];
  const hasSun = arena.getTimeOfDay() < 2;
  switch (arena.biomeType) {
    case Biome.GRASS:
      weatherPool = [{ weatherType: WeatherType.NONE, weight: 7 }];
      if (hasSun) {
        weatherPool.push({ weatherType: WeatherType.SUNNY, weight: 3 });
      }
      break;
    case Biome.TALL_GRASS:
      weatherPool = [
        { weatherType: WeatherType.NONE, weight: 8 },
        { weatherType: WeatherType.RAIN, weight: 5 },
      ];
      if (hasSun) {
        weatherPool.push({ weatherType: WeatherType.SUNNY, weight: 8 });
      }
      break;
    case Biome.FOREST:
      weatherPool = [
        { weatherType: WeatherType.NONE, weight: 8 },
        { weatherType: WeatherType.RAIN, weight: 5 },
      ];
      break;
    case Biome.SEA:
      weatherPool = [
        { weatherType: WeatherType.NONE, weight: 3 },
        { weatherType: WeatherType.RAIN, weight: 12 },
      ];
      break;
    case Biome.SWAMP:
      weatherPool = [
        { weatherType: WeatherType.NONE, weight: 3 },
        { weatherType: WeatherType.RAIN, weight: 4 },
        { weatherType: WeatherType.FOG, weight: 1 },
      ];
      break;
    case Biome.BEACH:
      weatherPool = [
        { weatherType: WeatherType.NONE, weight: 8 },
        { weatherType: WeatherType.RAIN, weight: 3 },
      ];
      if (hasSun) {
        weatherPool.push({ weatherType: WeatherType.SUNNY, weight: 5 });
      }
      break;
    case Biome.LAKE:
      weatherPool = [
        { weatherType: WeatherType.NONE, weight: 10 },
        { weatherType: WeatherType.RAIN, weight: 5 },
        { weatherType: WeatherType.FOG, weight: 1 },
      ];
      break;
    case Biome.SEABED:
      weatherPool = [{ weatherType: WeatherType.RAIN, weight: 1 }];
      break;
    case Biome.BADLANDS:
      weatherPool = [
        { weatherType: WeatherType.NONE, weight: 8 },
        { weatherType: WeatherType.SANDSTORM, weight: 2 },
      ];
      if (hasSun) {
        weatherPool.push({ weatherType: WeatherType.SUNNY, weight: 5 });
      }
      break;
    case Biome.DESERT:
      weatherPool = [{ weatherType: WeatherType.SANDSTORM, weight: 2 }];
      if (hasSun) {
        weatherPool.push({ weatherType: WeatherType.SUNNY, weight: 2 });
      }
      break;
    case Biome.ICE_CAVE:
      weatherPool = [
        { weatherType: WeatherType.NONE, weight: 3 },
        { weatherType: WeatherType.SNOW, weight: 4 },
        { weatherType: WeatherType.HAIL, weight: 1 },
      ];
      break;
    case Biome.MEADOW:
      weatherPool = [{ weatherType: WeatherType.NONE, weight: 2 }];
      if (hasSun) {
        weatherPool.push({ weatherType: WeatherType.SUNNY, weight: 2 });
      }
    case Biome.VOLCANO:
      weatherPool = [{ weatherType: hasSun ? WeatherType.SUNNY : WeatherType.NONE, weight: 1 }];
      break;
    case Biome.GRAVEYARD:
      weatherPool = [
        { weatherType: WeatherType.NONE, weight: 3 },
        { weatherType: WeatherType.FOG, weight: 1 },
      ];
      break;
    case Biome.JUNGLE:
      weatherPool = [
        { weatherType: WeatherType.NONE, weight: 8 },
        { weatherType: WeatherType.RAIN, weight: 2 },
      ];
      break;
    case Biome.SNOWY_FOREST:
      weatherPool = [
        { weatherType: WeatherType.SNOW, weight: 7 },
        { weatherType: WeatherType.HAIL, weight: 1 },
      ];
      break;
    case Biome.ISLAND:
      weatherPool = [
        { weatherType: WeatherType.NONE, weight: 5 },
        { weatherType: WeatherType.RAIN, weight: 1 },
      ];
      if (hasSun) {
        weatherPool.push({ weatherType: WeatherType.SUNNY, weight: 2 });
      }
      break;
  }

  if (weatherPool.length > 1) {
    let totalWeight = 0;
    weatherPool.forEach((w) => (totalWeight += w.weight));

    const rand = randSeedInt(totalWeight);
    let w = 0;
    for (const weather of weatherPool) {
      w += weather.weight;
      if (rand < w) {
        return weather.weatherType;
      }
    }
  }

  return weatherPool.length ? weatherPool[0].weatherType : WeatherType.NONE;
}
