/**
 * This file contains constants for what levels enemy Pokemon are supposed to evolve
 */

/** Used for most item based evolutions. The 36 comes from the fact that it's a good
 * level for a fully evolved Pokemon and also because that's what Pokemon Quest used
 */
export const GENERIC_ITEM_EVO_LEVEL = 36;
/**
 * Used for rarer evolutionary items or when the base Pokemon
 * is already pretty strong or evolves after GENERIC_ITEM_EVO_LEVEL
 *
 * Used for Rhydon, Electabuzz, Magmar, Porygon2
 */
export const ADVANCED_ITEM_EVO_LEVEL = 45;
/**
 * Baby Pokemon are significantly weaker so there are two tiers
 * of expected level for when they should appear as enemies
 */
export const BABY_HAPPINESS_EVO_LEVEL = 10;
export const HAPPINESS_EVO_LEVEL = 25;
/**
 * Default level at which evolutions that require a move will be applied for opponent Pokemon.
 * Note: filler value for now, meant to be broken down for individual Pokemon
 */
export const KNOW_MOVE_EVO_LEVEL = 36;
/** Learns Rage Fist at level 35 in gen 9 */
export const ANNIHILAPE_EVO_LEVEL = 35;
/** Learns Ancient Power at level 24 in gen 8 */
export const TANGROWTH_EVO_LEVEL = 24;
/** Learns rollout at level 6 in gen 8 and level 33 in gen 7 */
export const LICKILICKY_EVO_LEVEL = 33;
/** Learns mimic at level 32 in gen 8 and 15 in gen 7 */
export const MR_MIME_EVO_LEVEL = 15;
/** Temporary value for now */
export const SUPER_LATE_EVO_LEVEL = 64;
