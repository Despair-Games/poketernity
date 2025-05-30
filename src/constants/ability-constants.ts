// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Ability } from "#abilities/ability";
import type { SuppressWeatherEffectAbAttr } from "#abilities/suppress-weather-effect-ab-attr";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

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
