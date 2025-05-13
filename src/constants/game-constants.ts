// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { StatusEffect } from "#enums/status-effect";
import type { SystemSaveData } from "#types/SystemData";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

import { SpeciesFormKey } from "#enums/species-form-key";

/** Max value for an integer attribute in {@linkcode SystemSaveData} */
export const MAX_INT_ATTR_VALUE = 0x80000000;

/** The maximum size of the player's party */
export const PLAYER_PARTY_MAX_SIZE: number = 6;

/**
 * IVs are between 0 and 31 since in the mainline games it is stored as 5 bits.
 * Each point of IV is worth level/100 extra stat points before the nature multiplier
 */
export const IV_MIN = 0;
/**
 * IVs are between 0 and 31 since in the mainline games it is stored as 5 bits.
 * Each point of IV is worth level/100 extra stat points before the nature multiplier
 */
export const IV_MAX = 31;

/**
 * In the mainline games, dynamaxing increases HP from +50% to +100% in 5% intervals.
 * Below is a chart showing what an equivalent damage taken factor would be compared to
 * the increased HP.
 * ```
 * | HP Increase | Damage Taken Factor |
 * |-------------|---------------------|
 * | +50%        | 2/3                 |
 * | +60%        | 5/8                 |
 * | +70%        | ~0.588              |
 * | +80%        | ~0.556              |
 * | +90%        | ~0.526              |
 * | +100%       | 1/2                 |
 * ```
 * Tweak this value if necessary for balancing purposes
 */
export const DYNAMAX_DAMAGE_TAKEN_FACTOR = 2 / 3;

/** Custom implementation. Mainline is 0.6. */
export const FOG_ACCURACY_MULTIPLIER = 0.9;

/** The damage multiplier applied by Reflect, Light Screen, and Aurora Veil in single battles.*/
export const SCREEN_SINGLES_DMG_FACTOR = 0.5;

/** The damage multiplier applied by Reflect, Light Screen, and Aurora Veil in double battles.*/
export const SCREEN_DOUBLES_DMG_FACTOR = 2732 / 4096;

/** The scaling factor by how much higher the level cap is compared to the average Pokemon of a wave */
export const LEVEL_CAP_SCALE_FACTOR = 1.2;

/**
 * A list of all Gigantamax form keys, excluding Eternamax.
 */
export const G_MAX_FORM_KEYS = Object.freeze<string[]>([
  SpeciesFormKey.GIGANTAMAX,
  SpeciesFormKey.GIGANTAMAX_RAPID,
  SpeciesFormKey.GIGANTAMAX_SINGLE,
]);

/** Default amount of money the player starts with. Same for all game modes. */
export const DEFAULT_STARTING_MONEY = 1000;

/** The default duration of a freshly applied terrain (in turns). */
export const DEFAULT_NEW_TERRAIN_DURATION = 5;

/** Abbreviations from 10^0 to 10^33 @todo localize these */
export const LARGE_NUMBER_ABBREVIATIONS: string[] = ["", "K", "M", "B", "t", "q", "Q", "s", "S", "o", "n", "d"];

/**
 * The default min value for {@linkcode StatusEffect.SLEEP} when randomly setting the duration.
 * Number from {@link https://bulbapedia.bulbagarden.net/wiki/Sleep_(status_condition)#Generation_V | Gen 5+}
 *
 * Note: This equates to `1` turn of sleep, subtract `1` from this value to get the actual duration.
 */
export const DEFAULT_MIN_SLEEP_DURATION = 2;

/**
 * The default max value for {@linkcode StatusEffect.SLEEP} when randomly setting the duration.
 * Number from {@link https://bulbapedia.bulbagarden.net/wiki/Sleep_(status_condition)#Generation_V | Gen 5+}
 *
 * Note: This equates to `3` turns of sleep, subtract `1` from this value to get the actual duration.
 */
export const DEFAULT_MAX_SLEEP_DURATION = 4;
