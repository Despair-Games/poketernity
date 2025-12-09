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

/** Bit set for an ability's `bypassFaint` flag */
export const AB_FLAG_BYPASS_FAINT = 1; // 2 ** 0
/** Bit set for an ability's `ignorable` flag */
export const AB_FLAG_IGNORABLE = 2; // 2 ** 1
/** Bit set for an ability's `suppressable` flag */
export const AB_FLAG_SUPPRESSABLE = 4; // 2 ** 2
/** Bit set for an ability's `copiable` flag */
export const AB_FLAG_COPIABLE = 8; // 2 ** 3
/** Bit set for an ability's `replaceable` flag */
export const AB_FLAG_REPLACEABLE = 16; // 2 ** 4
/** Bit set for an ability's `noTransform` flag */
export const AB_FLAG_WORKS_WHEN_TRANSFORMED = 32; // 2 ** 5
/** Bit set for an ability's `partial` flag */
export const AB_FLAG_PARTIAL = 64; // 2 ** 6
/** Bit set for an ability's `unimplemented` flag */
export const AB_FLAG_UNIMPLEMENTED = 128; // 2 ** 7

/** Bits set for a swappable ability */
export const AB_FLAG_SWAPPABLE = AB_FLAG_COPIABLE | AB_FLAG_REPLACEABLE;
