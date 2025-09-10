import { getPokemonNameWithAffix } from "#app/messages";
import {
  RAIN_SYNERGY_ABILITIES,
  SAND_SYNERGY_ABILITIES,
  SNOW_SYNERGY_ABILITIES,
  SUN_SYNERGY_ABILITIES,
} from "#constants/ability-constants";
import {
  RAIN_SYNERGY_MOVES,
  SAND_SYNERGY_MOVES,
  SNOW_SYNERGY_MOVES,
  SUN_SYNERGY_MOVES,
} from "#constants/move-constants";
import type { AbilityId } from "#enums/ability-id";
import { ElementalType } from "#enums/elemental-type";
import type { MoveId } from "#enums/move-id";
import { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";
import i18next from "i18next";

// TODO: Should localization return null or "" as a default? Inconsistencies in the codebase

/**
 * Function to get the starting message for weather
 * @param weatherType - the {@linkcode WeatherType} starting
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
 * @param weatherType - the {@linkcode WeatherType} lapsing
 * @returns the associated string
 */
export function getWeatherLapseMessage(weatherType: WeatherType): string {
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
    case WeatherType.NONE:
      return "";
  }
}

/**
 * Function to get the associated message for when a Pokemon is damaged by weather (sandstorm or hail)
 * @param weatherType - The {@linkcode WeatherType}
 * @param pokemon - The {@linkcode Pokemon} being damaged
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
 * @param weatherType - the {@linkcode WeatherType} ending
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
 * Scores a weather-type pairing based on how well the type synergizes with the weather
 * @returns A decimal score representing the given weather's synergy with the given type
 *
 * @privateRemarks
 * The score from this function is intended for use in Enemy AI command selection only.
 */
export function getWeatherTypeSynergyScore(weatherType: WeatherType, elementalType: ElementalType): number {
  switch (weatherType) {
    case WeatherType.SUNNY:
    case WeatherType.HARSH_SUN:
      return getSunSynergyScore(elementalType);
    case WeatherType.RAIN:
    case WeatherType.HEAVY_RAIN:
      return getRainSynergyScore(elementalType);
    case WeatherType.SANDSTORM:
      return getSandstormSynergyScore(elementalType);
    case WeatherType.HAIL:
    case WeatherType.SNOW:
      return getSnowSynergyScore(elementalType);
    case WeatherType.FOG:
      return 0;
    case WeatherType.STRONG_WINDS:
      return getStrongWindsSynergyScore(elementalType);
    default: {
      weatherType satisfies WeatherType.NONE;
      return 0;
    }
  }
}

/** Scores the given type's synergy with Sun and Harsh Sun */
function getSunSynergyScore(elementalType: ElementalType): number {
  if (elementalType === ElementalType.FIRE) {
    return 1;
  }
  if (elementalType === ElementalType.WATER) {
    return -1;
  }
  return 0;
}

/** Scores the given type's synergy with Rain and Heavy Rain */
function getRainSynergyScore(elementalType: ElementalType): number {
  if (elementalType === ElementalType.WATER) {
    return 1;
  }
  if (elementalType === ElementalType.FIRE) {
    return -1;
  }
  return 0;
}

/** Scores the given type's synergy with Sandstorm */
function getSandstormSynergyScore(elementalType: ElementalType): number {
  if (elementalType === ElementalType.ROCK) {
    return 1;
  }
  const noDamageTypes: ElementalType[] = [ElementalType.GROUND, ElementalType.STEEL];
  if (noDamageTypes.includes(elementalType)) {
    return 0.5;
  }
  return 0;
}

/** Scores the given type's synergy with Hail and Snow */
function getSnowSynergyScore(elementalType: ElementalType): number {
  return elementalType === ElementalType.ICE ? 1 : 0;
}

/** Scores the given type's synergy with Strong Winds */
function getStrongWindsSynergyScore(elementalType: ElementalType): number {
  return elementalType === ElementalType.FLYING ? 1 : 0;
}

/**
 * @param weatherType - The {@linkcode WeatherType} to check
 * @returns A set of {@link AbilityId | IDs} for abilities that benefit from
 * the given weather type.
 */
export function getWeatherSynergyAbilities(weatherType: WeatherType): ReadonlySet<AbilityId> {
  switch (weatherType) {
    case WeatherType.SUNNY:
    case WeatherType.HARSH_SUN:
      return SUN_SYNERGY_ABILITIES;
    case WeatherType.RAIN:
    case WeatherType.HEAVY_RAIN:
      return RAIN_SYNERGY_ABILITIES;
    case WeatherType.SANDSTORM:
      return SAND_SYNERGY_ABILITIES;
    case WeatherType.HAIL:
    case WeatherType.SNOW:
      return SNOW_SYNERGY_ABILITIES;
    default:
      return new Set();
  }
}

/**
 * @param weatherType - The {@linkcode WeatherType} to check
 * @returns An array of {@link MoveId | IDs} for moves that benefit from
 * the given weather type.
 */
export function getWeatherSynergyMoves(weatherType: WeatherType): readonly MoveId[] {
  switch (weatherType) {
    case WeatherType.SUNNY:
    case WeatherType.HARSH_SUN:
      return SUN_SYNERGY_MOVES;
    case WeatherType.RAIN:
    case WeatherType.HEAVY_RAIN:
      return RAIN_SYNERGY_MOVES;
    case WeatherType.SANDSTORM:
      return SAND_SYNERGY_MOVES;
    case WeatherType.HAIL:
    case WeatherType.SNOW:
      return SNOW_SYNERGY_MOVES;
    default:
      return [];
  }
}
