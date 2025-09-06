/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { Ability } from "#abilities/ability";
import type { SuppressWeatherEffectAbAttr } from "#abilities/suppress-weather-effect-ab-attr";
import type { WeatherType } from "#enums/weather-type";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import { AbilityId } from "#enums/ability-id";

/**
 * Abilities that cause the source to ignore other Pokemon's abilities.
 * @see {@linkcode Ability.ignorable}
 */
export const IGNORING_ABILITIES = Object.freeze([AbilityId.MOLD_BREAKER, AbilityId.TERAVOLT, AbilityId.TURBOBLAZE]);

/**
 * Abilities that suppress weather effects.
 * @see {@linkcode SuppressWeatherEffectAbAttr}
 */
export const WEATHER_SUPPRESSING_ABILITIES = Object.freeze([AbilityId.CLOUD_NINE, AbilityId.AIR_LOCK]);

/** Abilities perceived by the Enemy AI to have high value */
export const HIGH_VALUE_ABILITIES: Readonly<AbilityId[]> = Object.freeze([
  AbilityId.WONDER_GUARD,
  AbilityId.DESOLATE_LAND,
  AbilityId.PRIMORDIAL_SEA,
  AbilityId.HUGE_POWER,
  AbilityId.PURE_POWER,
  AbilityId.CONTRARY,
]);

/** Abilities perceived by the Enemy AI to have a detrimental effect on the source */
export const DETRIMENTAL_ABILITIES: Readonly<AbilityId[]> = Object.freeze([
  AbilityId.TRUANT,
  AbilityId.WIMP_OUT,
  AbilityId.EMERGENCY_EXIT,
  AbilityId.DEFEATIST,
  AbilityId.KLUTZ,
  AbilityId.SLOW_START,
]);

/** Abilities that grant an immunity to Electric-type moves */
export const ELECTRIC_IMMUNE_ABILITIES: Readonly<AbilityId[]> = Object.freeze([
  AbilityId.VOLT_ABSORB,
  AbilityId.LIGHTNING_ROD,
  AbilityId.MOTOR_DRIVE,
]);

/** Abilities that grant a benefit when the source is under a non-volatile status effect */
export const ANY_STATUS_SYNERGY_ABILITIES = Object.freeze<AbilityId[]>([
  AbilityId.GUTS,
  AbilityId.QUICK_FEET,
  AbilityId.MARVEL_SCALE,
  AbilityId.MAGIC_GUARD,
]);

/** Abilities that grant a benefit when the source is burned */
export const BURN_SYNERGY_ABILITIES = Object.freeze<AbilityId[]>([
  ...ANY_STATUS_SYNERGY_ABILITIES,
  AbilityId.FLARE_BOOST,
]);

/** Abilities that grant a benefit when the source is poisoned (or badly poisoned) */
export const POISON_SYNERGY_ABILITIES = Object.freeze<AbilityId[]>([
  ...ANY_STATUS_SYNERGY_ABILITIES,
  AbilityId.TOXIC_BOOST,
  AbilityId.POISON_HEAL,
]);

/** Abilities that grant a benefit when the source poisons another Pokemon */
export const POISONING_SYNERGY_ABILITIES = Object.freeze<AbilityId[]>([
  AbilityId.MERCILESS,
  AbilityId.POISON_PUPPETEER,
]);

/** Abilities that grant a benefit when receiving a negative stat stage change */
export const POST_STAT_STAGE_REDUCTION_ABILITIES = Object.freeze<AbilityId[]>([
  AbilityId.DEFIANT,
  AbilityId.COMPETITIVE,
]);

/** Abilities that grant the source immunity to recoil damage from its attacks */
export const RECOIL_DAMAGE_PREVENTION_ABILITIES = Object.freeze<AbilityId[]>([
  AbilityId.ROCK_HEAD,
  AbilityId.MAGIC_GUARD,
]);

/**
 * Abilities that grant a benefit when {@link WeatherType.SUNNY | harsh sunlight}
 * or {@link WeatherType.HARSH_SUN | extremely harsh sunlight} is in effect
 */
export const SUN_SYNERGY_ABILITIES = Object.freeze<AbilityId[]>([
  AbilityId.CHLOROPHYLL,
  AbilityId.SOLAR_POWER,
  AbilityId.FLOWER_GIFT,
  AbilityId.LEAF_GUARD,
  AbilityId.PROTOSYNTHESIS,
  AbilityId.FORECAST,
]);

/**
 * Abilities that grant a benefit when {@link WeatherType.RAIN | rain}
 * or {@link WeatherType.HEAVY_RAIN | heavy rain} is in effect
 */
export const RAIN_SYNERGY_ABILITIES = Object.freeze<AbilityId[]>([
  AbilityId.SWIFT_SWIM,
  AbilityId.RAIN_DISH,
  AbilityId.DRY_SKIN,
  AbilityId.HYDRATION,
  AbilityId.FORECAST,
]);

/**
 * Abilities that grant a benefit when a {@link WeatherType.SANDSTORM | sandstorm}
 * is in effect
 */
export const SAND_SYNERGY_ABILITIES = Object.freeze<AbilityId[]>([
  AbilityId.SAND_FORCE,
  AbilityId.SAND_RUSH,
  AbilityId.SAND_VEIL,
  AbilityId.MAGIC_GUARD,
  AbilityId.OVERCOAT,
]);

/**
 * Abilities that grant a benefit when {@link WeatherType.HAIL | hail}
 * or {@link WeatherType.SNOW | snow} is in effect
 */
export const SNOW_SYNERGY_ABILITIES = Object.freeze<AbilityId[]>([
  AbilityId.ICE_BODY,
  AbilityId.SNOW_CLOAK,
  AbilityId.SLUSH_RUSH,
  AbilityId.ICE_FACE,
]);
