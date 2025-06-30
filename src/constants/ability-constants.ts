/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { Ability } from "#abilities/ability";
import type { SuppressWeatherEffectAbAttr } from "#abilities/suppress-weather-effect-ab-attr";
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
