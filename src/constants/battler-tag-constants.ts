// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ElementalType } from "#enums/elemental-type";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

import { BattlerTagType } from "#enums/battler-tag-type";

/** All {@linkcode BattlerTagType | BattlerTagTypes} that grant semi-invulnerability */
export const SEMI_INVULNERABLE_BATTLER_TAG_TYPES = Object.freeze([
  BattlerTagType.FLYING,
  BattlerTagType.UNDERGROUND,
  BattlerTagType.UNDERWATER,
  BattlerTagType.HIDDEN,
]);

/** All {@linkcode BattlerTagType | BattlerTagTypes} that grant protection/invulnerability */
export const PROTECTION_BATTLER_TAG_TYPES = Object.freeze([
  BattlerTagType.PROTECTED,
  BattlerTagType.BANEFUL_BUNKER,
  BattlerTagType.SPIKY_SHIELD,
  BattlerTagType.SILK_TRAP,
  BattlerTagType.BURNING_BULWARK,
  BattlerTagType.KINGS_SHIELD,
  BattlerTagType.OBSTRUCT,
]);

/** All {@linkcode BattlerTagType | BattlerTagTypes} that lock a move in.  */
export const MOVE_LOCK_TAG_TYPES = Object.freeze([
  BattlerTagType.FRENZY,
  BattlerTagType.ROLLING,
  BattlerTagType.UPROAR,
  BattlerTagType.BIDE,
]);

/** All unstackable {@linkcode BattlerTagType | BattlerTagTypes} that boost critical hit rate. */
export const CRIT_BOOST_BATTLER_TAG_TYPES = Object.freeze([BattlerTagType.CRIT_BOOST, BattlerTagType.DRAGON_CHEER]);

/** All {@linkcode BattlerTagType | BattlerTagTypes} that remove an {@linkcode ElementalType}. */
export const REMOVE_TYPE_BATTLER_TAG_TYPES = Object.freeze([BattlerTagType.BURNED_UP, BattlerTagType.DOUBLE_SHOCKED]);

/** All {@linkcode BattlerTagType | BattlerTagTypes} that trap in a fire spin. */
export const FIRE_SPIN_TRAPPED_BATTLER_TAG_TYPES = Object.freeze([
  BattlerTagType.FIRE_SPIN,
  BattlerTagType.G_MAX_FIRE_SPIN,
]);

/** All {@linkcode BattlerTagType | BattlerTagTypes} that trap in a vortex. */
export const VORTEX_TRAPPED_BATTLER_TAG_TYPES = Object.freeze([
  BattlerTagType.WHIRLPOOL,
  ...FIRE_SPIN_TRAPPED_BATTLER_TAG_TYPES,
]);

/** All {@linkcode BattlerTagType | BattlerTagTypes} that trap and deal damage. */
export const DAMAGING_TRAPPED_BATTLER_TAG_TYPES = Object.freeze([
  BattlerTagType.BIND,
  BattlerTagType.WRAP,
  BattlerTagType.CLAMP,
  BattlerTagType.SAND_TOMB,
  BattlerTagType.G_MAX_SAND_TOMB,
  BattlerTagType.MAGMA_STORM,
  BattlerTagType.SNAP_TRAP,
  BattlerTagType.THUNDER_CAGE,
  BattlerTagType.INFESTATION,
  ...VORTEX_TRAPPED_BATTLER_TAG_TYPES,
]);

/** All {@linkcode BattlerTagType | BattlerTagTypes} that trap. */
export const TRAPPED_BATTLER_TAG_TYPES = Object.freeze([
  BattlerTagType.TRAPPED,
  BattlerTagType.NO_RETREAT,
  BattlerTagType.OCTOLOCK,
  BattlerTagType.INGRAIN,
  ...DAMAGING_TRAPPED_BATTLER_TAG_TYPES,
]);

/** All {@linkcode BattlerTagType | BattlerTagTypes} that are a Gulp Missile. */
export const GULP_MISSILE_BATTLER_TAG_TYPES = Object.freeze([
  BattlerTagType.GULP_MISSILE_ARROKUDA,
  BattlerTagType.GULP_MISSILE_PIKACHU,
]);

/** All {@linkcode BattlerTagType | BattlerTagTypes} that boost an {@linkcode ElementalType}. */
export const TYPE_BOOST_TAG_TYPES = Object.freeze([BattlerTagType.FIRE_BOOST, BattlerTagType.CHARGED]);

/** All {@linkcode BattlerTagType | BattlerTagTypes} that make a pokemon "exposed". */
export const EXPOSED_TAG_TYPES = Object.freeze([BattlerTagType.IGNORE_GHOST, BattlerTagType.IGNORE_DARK]);
