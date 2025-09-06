/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { WeatherType } from "#enums/weather-type";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import { MoveId } from "#enums/move-id";

/** An array of all tera {@linkcode MoveId | MoveIds}. */
export const TERA_MOVES = Object.freeze<MoveId[]>([MoveId.TERA_BLAST, MoveId.TERA_STARSTORM]);

/** An array of all pledge {@linkcode MoveId | MoveIds}. */
export const PLEDGE_MOVES = Object.freeze<MoveId[]>([MoveId.GRASS_PLEDGE, MoveId.FIRE_PLEDGE, MoveId.WATER_PLEDGE]);

/** An array of all sacrificial {@linkcode MoveId | MoveIds}. */
export const SACRIFICIAL_MOVES = Object.freeze<MoveId[]>([
  MoveId.SELF_DESTRUCT,
  MoveId.EXPLOSION,
  MoveId.MEMENTO,
  MoveId.FINAL_GAMBIT,
  MoveId.MISTY_EXPLOSION,
  MoveId.HEALING_WISH,
  MoveId.LUNAR_DANCE,
]);

/** An array containing the {@linkcode MoveId | MoveIds} for all variations of the move Protect */
export const PROTECT_MOVES = Object.freeze<MoveId[]>([
  MoveId.PROTECT,
  MoveId.DETECT,
  MoveId.ENDURE,
  MoveId.SPIKY_SHIELD,
  MoveId.KINGS_SHIELD,
  MoveId.BANEFUL_BUNKER,
  MoveId.OBSTRUCT,
  MoveId.BURNING_BULWARK,
  MoveId.SILK_TRAP,
]);

/** An array containing the {@linkcode MoveId | MoveIds} for all Status moves that set hazards */
export const HAZARD_STATUS_MOVES = Object.freeze<MoveId[]>([
  MoveId.SPIKES,
  MoveId.TOXIC_SPIKES,
  MoveId.STEALTH_ROCK,
  MoveId.STICKY_WEB,
]);

/**
 * Moves that gain a benefit when used while {@link WeatherType.SUNNY | harsh sunlight} or
 * {@link WeatherType.HARSH_SUN | extremely harsh sunlight} is in effect
 */
export const SUN_SYNERGY_MOVES = Object.freeze<MoveId[]>([
  MoveId.WEATHER_BALL,
  MoveId.GROWTH,
  MoveId.SOLAR_BEAM,
  MoveId.SOLAR_BLADE,
  MoveId.MOONLIGHT,
  MoveId.SYNTHESIS,
  MoveId.MORNING_SUN,
  MoveId.HYDRO_STEAM,
]);

/**
 * Moves that gain a benefit when used while {@link WeatherType.RAIN | rain} or
 * {@link WeatherType.HEAVY_RAIN | heavy rain} is in effect
 */
export const RAIN_SYNERGY_MOVES = Object.freeze<MoveId[]>([
  MoveId.WEATHER_BALL,
  MoveId.THUNDER,
  MoveId.HURRICANE,
  MoveId.BLEAKWIND_STORM,
  MoveId.WILDBOLT_STORM,
  MoveId.SANDSEAR_STORM,
  MoveId.ELECTRO_SHOT,
]);

/**
 * Moves that gain a benefit when used while a {@link WeatherType.SANDSTORM | sandstorm}
 * is in effect
 */
export const SAND_SYNERGY_MOVES = Object.freeze<MoveId[]>([MoveId.WEATHER_BALL, MoveId.SHORE_UP]);

/**
 * Moves that gain a benefit when used while {@link WeatherType.HAIL | hail} or
 * {@link WeatherType.SNOW | snow} is in effect
 */
export const SNOW_SYNERGY_MOVES = Object.freeze<MoveId[]>([MoveId.WEATHER_BALL, MoveId.BLIZZARD, MoveId.AURORA_VEIL]);
