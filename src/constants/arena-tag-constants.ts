// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ElementalType } from "#enums/elemental-type";
import type { Move } from "#moves/move";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

import { ArenaTagType } from "#enums/arena-tag-type";

/** All {@linkcode ArenaTagType | ArenaTagTypes} that weaken attacks of a certain {@linkcode ElementalType}. */
export const WEAKEN_MOVE_TYPE_ARENA_TAG_TYPES = Object.freeze<ArenaTagType[]>([
  ArenaTagType.MUD_SPORT,
  ArenaTagType.WATER_SPORT,
]);

/** All {@linkcode ArenaTagType | ArenaTagTypes} that present an entry hazard. */
export const ENTRY_HAZARD_ARENA_TAG_TYPES = Object.freeze<ArenaTagType[]>([
  ArenaTagType.SPIKES,
  ArenaTagType.TOXIC_SPIKES,
  ArenaTagType.STEALTH_ROCK,
  ArenaTagType.SHARP_STEEL,
  ArenaTagType.STICKY_WEB,
]);

/** All {@linkcode ArenaTagType | ArenaTagTypes} that weaken a {@linkcode Move}'s strength (as a screen). */
export const WEAKEN_MOVE_SCREEN_ARENA_TAG_TYPES = Object.freeze<ArenaTagType[]>([
  ArenaTagType.REFLECT,
  ArenaTagType.AURORA_VEIL,
  ArenaTagType.LIGHT_SCREEN,
]);

/** All {@linkcode ArenaTagType | ArenaTagTypes} that grant protection/invulnerability under certain conditions. */
export const CONDITIONAL_PROTECT_ARENA_TAG_TYPES = Object.freeze<ArenaTagType[]>([
  ArenaTagType.QUICK_GUARD,
  ArenaTagType.WIDE_GUARD,
  ArenaTagType.MAT_BLOCK,
  ArenaTagType.CRAFTY_SHIELD,
]);

/** All {@linkcode ArenaTagType}s that can be swapped by {@linkcode MoveId.COURT_CHANGE}. */
export const COURT_CHANGE_ARENA_TAG_TYPES = Object.freeze<ArenaTagType[]>([
  ArenaTagType.AURORA_VEIL,
  ArenaTagType.LIGHT_SCREEN,
  ArenaTagType.MIST,
  ArenaTagType.REFLECT,
  ArenaTagType.SPIKES,
  ArenaTagType.STEALTH_ROCK,
  ArenaTagType.SHARP_STEEL,
  ArenaTagType.STICKY_WEB,
  ArenaTagType.TAILWIND,
  ArenaTagType.TOXIC_SPIKES,
  ArenaTagType.SAFEGUARD,
  ArenaTagType.GRASS_WATER_PLEDGE,
  ArenaTagType.FIRE_GRASS_PLEDGE,
  ArenaTagType.WATER_FIRE_PLEDGE,
  ArenaTagType.G_MAX_VINE_LASH,
  ArenaTagType.G_MAX_WILDFIRE,
  ArenaTagType.G_MAX_CANNONADE,
  ArenaTagType.G_MAX_VOLCALITH,
]);
