import type { CritBoostTag } from "#battler-tags/crit-boost-tag";
import type { DamagingTrapTag } from "#battler-tags/damaging-trap-tag";
import type { ExposedTag } from "#battler-tags/exposed-tag";
import type { FloatingTag } from "#battler-tags/floating-tag";
import type { GulpMissileTag } from "#battler-tags/gulp-missile-tag";
import type { HighestStatBoostTag } from "#battler-tags/highest-stat-boost-tag";
import type { MoveLockTag } from "#battler-tags/move-lock-tag";
import type { MoveRestrictionBattlerTag } from "#battler-tags/move-restriction-battler-tag";
import type { ProtectedTag } from "#battler-tags/protected-tag";
import type { RemovedTypeTag } from "#battler-tags/removed-type-tag";
import type { SemiInvulnerableTag } from "#battler-tags/semi-invulnerable-tag";
import type { TrappedTag } from "#battler-tags/trapped-tag";
import type { TypeBoostTag } from "#battler-tags/type-boost-tag";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { ElementalType } from "#enums/elemental-type";

/**
 * All {@linkcode BattlerTagType}s that grant semi-invulnerability.
 * @see {@linkcode SemiInvulnerableTag}
 */
export const SEMI_INVULNERABLE_BATTLER_TAG_TYPES = Object.freeze<BattlerTagType[]>([
  BattlerTagType.MID_AIR,
  BattlerTagType.UNDERGROUND,
  BattlerTagType.UNDERWATER,
  BattlerTagType.HIDDEN,
]);

/**
 * All {@linkcode BattlerTagType}s that grant protection/invulnerability
 * @see {@linkcode ProtectedTag}
 */
export const PROTECTION_BATTLER_TAG_TYPES = Object.freeze<BattlerTagType[]>([
  BattlerTagType.PROTECTED,
  BattlerTagType.BANEFUL_BUNKER,
  BattlerTagType.SPIKY_SHIELD,
  BattlerTagType.SILK_TRAP,
  BattlerTagType.BURNING_BULWARK,
  BattlerTagType.KINGS_SHIELD,
  BattlerTagType.OBSTRUCT,
]);

/**
 * All {@linkcode BattlerTagType}s that lock a user into a move.
 * @see {@linkcode MoveLockTag}
 */
export const MOVE_LOCK_TAG_TYPES = Object.freeze<BattlerTagType[]>([
  BattlerTagType.FRENZY,
  BattlerTagType.ROLLING,
  BattlerTagType.UPROAR,
  BattlerTagType.BIDE,
]);

/**
 * All unstackable {@linkcode BattlerTagType}s that boost critical hit rate.
 * @see {@linkcode CritBoostTag}
 */
export const CRIT_BOOST_BATTLER_TAG_TYPES = Object.freeze<BattlerTagType[]>([
  BattlerTagType.CRIT_BOOST,
  BattlerTagType.DRAGON_CHEER,
]);

/**
 * All {@linkcode BattlerTagType}s that remove an {@linkcode ElementalType}.
 * @see {@linkcode RemovedTypeTag}
 */
export const REMOVE_TYPE_BATTLER_TAG_TYPES = Object.freeze<BattlerTagType[]>([
  BattlerTagType.BURNED_UP,
  BattlerTagType.DOUBLE_SHOCKED,
]);

/** All {@linkcode BattlerTagType}s that trap in a fire spin. */
const FIRE_SPIN_TRAPPED_BATTLER_TAG_TYPES = Object.freeze<BattlerTagType[]>([
  BattlerTagType.FIRE_SPIN,
  BattlerTagType.G_MAX_FIRE_SPIN,
]);

/** All {@linkcode BattlerTagType}s that trap in a "vortex". */
const VORTEX_TRAPPED_BATTLER_TAG_TYPES = Object.freeze<BattlerTagType[]>([
  BattlerTagType.WHIRLPOOL,
  ...FIRE_SPIN_TRAPPED_BATTLER_TAG_TYPES,
]);

/**
 * All {@linkcode BattlerTagType}s that trap and deal damage.
 * @see {@linkcode DamagingTrapTag}
 */
export const DAMAGING_TRAPPED_BATTLER_TAG_TYPES = Object.freeze<BattlerTagType[]>([
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

/**
 * All {@linkcode BattlerTagType}s that trap a pokemon.
 * @see {@linkcode TrappedTag}
 */
export const TRAPPED_BATTLER_TAG_TYPES = Object.freeze<BattlerTagType[]>([
  BattlerTagType.TRAPPED,
  BattlerTagType.NO_RETREAT,
  BattlerTagType.OCTOLOCK,
  BattlerTagType.INGRAIN,
  ...DAMAGING_TRAPPED_BATTLER_TAG_TYPES,
]);

/**
 * All {@linkcode BattlerTagType}s that are a Gulp Missile.
 * @see {@linkcode GulpMissileTag}
 */
export const GULP_MISSILE_BATTLER_TAG_TYPES = Object.freeze<BattlerTagType[]>([
  BattlerTagType.GULP_MISSILE_ARROKUDA,
  BattlerTagType.GULP_MISSILE_PIKACHU,
]);

/**
 * All {@linkcode BattlerTagType}s that boost an {@linkcode ElementalType}.
 * @see {@linkcode TypeBoostTag}
 */
export const TYPE_BOOST_TAG_TYPES = Object.freeze<BattlerTagType[]>([
  BattlerTagType.FIRE_BOOST,
  BattlerTagType.CHARGED,
]);

/**
 * All {@linkcode BattlerTagType}s that make a pokemon "exposed".
 * @see {@linkcode ExposedTag}
 */
export const EXPOSED_TAG_TYPES = Object.freeze<BattlerTagType[]>([
  BattlerTagType.IGNORE_GHOST,
  BattlerTagType.IGNORE_DARK,
]);

/**
 * All {@linkcode BattlerTagType}s that boost the pokemon's highest stat.
 * @see {@linkcode HighestStatBoostTag}
 */
export const HIGHEST_STAT_BOOST_TAG_TYPES = Object.freeze<BattlerTagType[]>([
  BattlerTagType.PROTOSYNTHESIS,
  BattlerTagType.QUARK_DRIVE,
]);

/**
 * All {@linkcode BattlerTagType}s that make a pokemon immune to a type
 * @see {@linkcode FloatingTag}
 */
export const TYPE_IMMUNE_TAG_TYPES = Object.freeze<BattlerTagType[]>([BattlerTagType.FLOATING]);

/**
 * All {@linkcode BattlerTagType}s that restrict a pokemon's move usage
 * @see {@linkcode MoveRestrictionBattlerTag}
 */
export const RESTRICTING_TAG_TYPES = Object.freeze<BattlerTagType[]>([
  BattlerTagType.DISABLED,
  BattlerTagType.ENCORE,
  BattlerTagType.GORILLA_TACTICS,
  BattlerTagType.HEAL_BLOCK,
  BattlerTagType.TAUNT,
  BattlerTagType.THROAT_CHOPPED,
  BattlerTagType.TORMENT,
]);
