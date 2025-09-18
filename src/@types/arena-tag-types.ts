/** biome-ignore-start lint/correctness/noUnusedImports: TSDoc imports */
import type { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#field/pokemon";
import type { SessionSaveData } from "#types/session-data";
/** biome-ignore-end lint/correctness/noUnusedImports: TSDoc imports */

import type { AuroraVeilTag } from "#arena-tags/aurora-veil-tag";
import type { CraftyShieldTag } from "#arena-tags/crafty-shield-tag";
import type { DelayedAttackTag } from "#arena-tags/delayed-attack-tag";
import type { FairyLockTag } from "#arena-tags/fairy-lock-tag";
import type { FireGrassPledgeTag } from "#arena-tags/fire-grass-pledge-tag";
import type { GrassWaterPledgeTag } from "#arena-tags/grass-water-pledge-tag";
import type { GravityTag } from "#arena-tags/gravity-tag";
import type { HappyHourTag } from "#arena-tags/happy-hour-tag";
import type { IonDelugeTag } from "#arena-tags/ion-deluge-tag";
import type { LightScreenTag } from "#arena-tags/light-screen-tag";
import type { MatBlockTag } from "#arena-tags/mat-block-tag";
import type { MistTag } from "#arena-tags/mist-tag";
import type { MudSportTag } from "#arena-tags/mud-sport-tag";
import type { NoCritTag } from "#arena-tags/no-crit-tag";
import type { PendingHealTag } from "#arena-tags/pending-heal-tag";
import type { QuickGuardTag } from "#arena-tags/quick-guard-tag";
import type { ReflectTag } from "#arena-tags/reflect-tag";
import type { SafeguardTag } from "#arena-tags/safeguard-tag";
import type { SpikesTag } from "#arena-tags/spikes-tag";
import type { StealthRockTag } from "#arena-tags/stealth-rock-tag";
import type { StickyWebTag } from "#arena-tags/sticky-web-tag";
import type { TailwindTag } from "#arena-tags/tailwind-tag";
import type { ToxicSpikesTag } from "#arena-tags/toxic-spikes-tag";
import type { TrickRoomTag } from "#arena-tags/trick-room-tag";
import type { TypeHazardTag } from "#arena-tags/type-hazard-tag";
import type { TypeImmuneDamageOverTimeTag } from "#arena-tags/type-immune-damage-over-time-tag";
import type { WaterFirePledgeTag } from "#arena-tags/water-fire-pledge-tag";
import type { WaterSportTag } from "#arena-tags/water-sport-tag";
import type { WideGuardTag } from "#arena-tags/wide-guard-tag";
import type { WishTag } from "#arena-tags/wish-tag";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import type { ArenaTagType } from "#enums/arena-tag-type";
import type { MoveId } from "#enums/move-id";

/** Subset of {@linkcode ArenaTagType}s that deal type-based damage to pokemon that switch in. */
export type TypeHazardTagType = typeof ArenaTagType.STEALTH_ROCK | typeof ArenaTagType.SHARP_STEEL;

/**
 * Subset of {@linkcode ArenaTagType}s that apply some negative effect to pokemon that switch in.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/List_of_moves_that_cause_entry_hazards#List_of_traps}
 */
export type EntryHazardTagType =
  | TypeHazardTagType
  | typeof ArenaTagType.STICKY_WEB
  | typeof ArenaTagType.SPIKES
  | typeof ArenaTagType.TOXIC_SPIKES;

/** Subset of {@linkcode ArenaTagType}s that create {@link https://bulbapedia.bulbagarden.net/wiki/Category:Screen-creating_moves | screens}. */
export type ArenaScreenTagType =
  | typeof ArenaTagType.REFLECT
  | typeof ArenaTagType.LIGHT_SCREEN
  | typeof ArenaTagType.AURORA_VEIL;

/** Subset of {@linkcode ArenaTagType}s for moves that add protection */
export type TurnProtectArenaTagType =
  | typeof ArenaTagType.QUICK_GUARD
  | typeof ArenaTagType.WIDE_GUARD
  | typeof ArenaTagType.MAT_BLOCK
  | typeof ArenaTagType.CRAFTY_SHIELD;

/** Subset of {@linkcode ArenaTagType}s that deal damage over time except to specific {@linkcode ElementalType | types}. */
export type TypeImmuneDamageOverTimeTagType =
  | typeof ArenaTagType.G_MAX_CANNONADE
  | typeof ArenaTagType.G_MAX_VINE_LASH
  | typeof ArenaTagType.G_MAX_VOLCALITH
  | typeof ArenaTagType.G_MAX_WILDFIRE;

/** Subset of {@linkcode ArenaTagType}s that cannot persist across turns, and thus should not be serialized in {@linkcode SessionSaveData}. */
export type NonSerializableArenaTagType = TurnProtectArenaTagType | typeof ArenaTagType.ION_DELUGE;

/** Subset of {@linkcode ArenaTagType}s that may persist across turns, and thus must be serialized in {@linkcode SessionSaveData}. */
export type SerializableArenaTagType = Exclude<ArenaTagType, NonSerializableArenaTagType>;

/**
 * Type-safe representation of an arbitrary, serialized Arena Tag
 */
export type ArenaTagTypeData = Parameters<
  ArenaTagTypeMap[keyof {
    [K in keyof ArenaTagTypeMap as K extends SerializableArenaTagType ? K : never]: ArenaTagTypeMap[K];
  }]["loadTag"]
>[0];

/**
 * Dummy, typescript-only declaration to ensure that
 * {@linkcode ArenaTagTypeMap} has a map for all ArenaTagTypes.
 *
 * If an arena tag is missing from the map, typescript will throw an error on this statement.
 *
 * ⚠️ Does not actually exist at runtime, so it must not be used!
 */
declare const EnsureAllArenaTagTypesAreMapped: ArenaTagTypeMap[ArenaTagType] & never;

/** Interface containing the serializable fields of ArenaTagData. */
export interface BaseArenaTag {
  /**
   * The tag's remaining duration. Setting to any number `<=0` will make the tag's duration effectively infinite.
   */
  turnCount: number;
  /**
   * The {@linkcode MoveId} that created this tag, or `undefined` if not set by a move.
   */
  sourceMoveId?: MoveId;
  /**
   * The {@linkcode Pokemon.id | PID} of the {@linkcode Pokemon} having created the tag, or `undefined` if not set by a Pokemon.
   * @todo Implement handling for `ArenaTag`s created by non-pokemon sources (most tags will throw errors without a source)
   */
  // Note: Intentionally not using `?`, as the property should always exist, but just be undefined if not present.
  sourceId: number | undefined;
  /**
   * The {@linkcode ArenaTagSide | side of the field} that this arena tag affects.
   * @defaultValue `ArenaTagSide.BOTH`
   */
  side: ArenaTagSide;
}

export type ArenaTagTypeMap = {
  [ArenaTagType.MUD_SPORT]: MudSportTag;
  [ArenaTagType.WATER_SPORT]: WaterSportTag;
  [ArenaTagType.ION_DELUGE]: IonDelugeTag;
  [ArenaTagType.SPIKES]: SpikesTag;
  [ArenaTagType.MIST]: MistTag;
  [ArenaTagType.QUICK_GUARD]: QuickGuardTag;
  [ArenaTagType.WIDE_GUARD]: WideGuardTag;
  [ArenaTagType.MAT_BLOCK]: MatBlockTag;
  [ArenaTagType.CRAFTY_SHIELD]: CraftyShieldTag;
  [ArenaTagType.NO_CRIT]: NoCritTag;
  [ArenaTagType.TOXIC_SPIKES]: ToxicSpikesTag;
  [ArenaTagType.DELAYED_ATTACK]: DelayedAttackTag;
  [ArenaTagType.WISH]: WishTag;
  [ArenaTagType.STEALTH_ROCK]: StealthRockTag;
  [ArenaTagType.STICKY_WEB]: StickyWebTag;
  [ArenaTagType.TRICK_ROOM]: TrickRoomTag;
  [ArenaTagType.GRAVITY]: GravityTag;
  [ArenaTagType.REFLECT]: ReflectTag;
  [ArenaTagType.LIGHT_SCREEN]: LightScreenTag;
  [ArenaTagType.AURORA_VEIL]: AuroraVeilTag;
  [ArenaTagType.TAILWIND]: TailwindTag;
  [ArenaTagType.HAPPY_HOUR]: HappyHourTag;
  [ArenaTagType.SAFEGUARD]: SafeguardTag;
  [ArenaTagType.FIRE_GRASS_PLEDGE]: FireGrassPledgeTag;
  [ArenaTagType.WATER_FIRE_PLEDGE]: WaterFirePledgeTag;
  [ArenaTagType.GRASS_WATER_PLEDGE]: GrassWaterPledgeTag;
  [ArenaTagType.FAIRY_LOCK]: FairyLockTag;
  [ArenaTagType.G_MAX_CANNONADE]: TypeImmuneDamageOverTimeTag;
  [ArenaTagType.G_MAX_VINE_LASH]: TypeImmuneDamageOverTimeTag;
  [ArenaTagType.G_MAX_VOLCALITH]: TypeImmuneDamageOverTimeTag;
  [ArenaTagType.G_MAX_WILDFIRE]: TypeImmuneDamageOverTimeTag;
  [ArenaTagType.SHARP_STEEL]: TypeHazardTag;
  [ArenaTagType.PENDING_HEAL]: PendingHealTag;
  // [ArenaTagType.NEUTRALIZING_GAS]: SuppressAbilitiesTag;
};
