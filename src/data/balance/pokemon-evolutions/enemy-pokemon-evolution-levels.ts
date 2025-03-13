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
 * Used for Rhydon, Electabuzz, Magmar, Porygon2,
 * Ursaring, Piloswine,
 * Dusclops
 * Eelektrick, Lampent
 * Doublade
 * Duraludon
 */
export const ADVANCED_ITEM_EVO_LEVEL = 45;
/**
 * Baby Pokemon are significantly weaker so there are two tiers
 * of expected level for when they should appear as enemies
 */
export const BABY_HAPPINESS_EVO_LEVEL = 10;
export const HAPPINESS_EVO_LEVEL = 25;
/** Enemy evolve level for Slowking and Galar Slowbro and Galar Slowking */
export const SLOWPOKE_FAMILY_EVO_LEVEL = 37;
/** Learns Rage Fist at level 35 in gen 9 */
export const ANNIHILAPE_EVO_LEVEL = 35;
/** Learns Ancient Power at level 24 in gen 8 */
export const TANGROWTH_EVO_LEVEL = 24;
/** Learns rollout at level 6 in gen 8 and level 33 in gen 7 */
export const LICKILICKY_EVO_LEVEL = 33;
/** Learns mimic at level 32 in gen 8 and 15 in gen 7 */
export const MR_MIME_EVO_LEVEL = 15;
/** In case the enemy evolution level for the Eevee family ever changes */
export const EEVEE_FAMILY_EVO_LEVEL = GENERIC_ITEM_EVO_LEVEL;
/** Learns mimic at level 16 in gen 8 */
export const SUDOWOODO_EVO_LEVEL = 16;
/** Learns double hit at level 32 in gen 9 */
export const AMBIPOM_EVO_LEVEL = 32;
/** Learns ancient power at level 33 in gen 9 */
export const YANMEGA_EVO_LEVEL = 33;
/** Learns twin beam at level 32 in gen 9 */
export const FARIGARIF_EVO_LEVEL = 32;
/** Piloswine learns Ancient Power at level 1 so enemy evolve level here is changed */
export const MAMOSWINE_EVO_LEVEL = ADVANCED_ITEM_EVO_LEVEL;
/** Learns hyper drill at level 32 in gen 9 */
export const DUDUNSPARCE_EVO_LEVEL = 32;
/** Learns psyshield bash at level 21, masters it at 31 in PLA */
export const WYRDEER_EVO_LEVEL = 21;
/** Learns wave crash at level 44 in gen 9 */
export const BASCULEGION_EVO_LEVEL = 44;
/** Level obtained from Geeta's Kingambit */
export const KINGAMBIT_EVO_LEVEL = 61;
/** Learns stomp at level 28 in gen 9 */
export const TSAREENA_EVO_LEVEL = 28;
/** Poipole learns dragon pulse at level 1 so enemy evolve level is changed */
export const NAGANADEL_EVO_LEVEL = ADVANCED_ITEM_EVO_LEVEL;
/** Learns taunt at level 35 in gen 8 */
export const GRAPPLOCT_EVO_LEVEL = 35;
/** Dipplin learns dragon cheer at level 1 (custom implementation)
 * and should have a different enemy evolve level than Applin
 */
export const HYDRAPPLE_EVO_LEVEL = ADVANCED_ITEM_EVO_LEVEL;
/** Completely custom implementation.
 * Using 25 for air cutter, the first high crit move
 * that Farfetch'd learns. Also learns slash at 40
 * */
export const SIRFETCHD_EVO_LEVEL = 25;
/** Learns barb barage at level 28 in gen 9 */
export const OVERQWIL_EVO_LEVEL = 28;
/** All 3 of these pokemon evolve with the let's go walking 1000 steps feature */
/** Chosen because that's when Pawmot learns arm thrust */
export const PAWMOT_EVO_LEVEL = 25;
/** Bramblin and Brambleghast have the same learnset... */
export const BRAMBLEGHAST_EVO_LEVEL = 20;
/** Chosen because that's when Rabsca learns psybeam */
export const RABSCA_EVO_LEVEL = 15;
/** Gholdengo is strong and has a complex custom evolution method */
export const GHOLDENGO_EVO_LEVEL = ADVANCED_ITEM_EVO_LEVEL;
