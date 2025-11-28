import type { ArenaTag } from "#arena-tags/arena-tag";
import type { ArenaTagTypeMap, NonSerializableArenaTagType, SerializableArenaTagType } from "#types/arena-tag-types";
import type { ObjectValues } from "#types/utility-types";

/**
 * Enum representing all different types of {@linkcode ArenaTag}s.
 * @privateRemarks
 * ⚠️ When modifying the fields in this enum, ensure that:
 * - The entry is added to / removed from {@linkcode ArenaTagTypeMap}
 * - The tag is added to / removed from {@linkcode NonSerializableArenaTagType} or {@linkcode SerializableArenaTagType}
 */
export const ArenaTagType = {
  MUD_SPORT: 1,
  WATER_SPORT: 2,
  SPIKES: 3,
  TOXIC_SPIKES: 4,
  MIST: 5,
  WISH: 6,
  STEALTH_ROCK: 7,
  STICKY_WEB: 8,
  TRICK_ROOM: 9,
  GRAVITY: 10,
  REFLECT: 11,
  LIGHT_SCREEN: 12,
  AURORA_VEIL: 13,
  QUICK_GUARD: 14,
  WIDE_GUARD: 15,
  MAT_BLOCK: 16,
  CRAFTY_SHIELD: 17,
  TAILWIND: 18,
  HAPPY_HOUR: 19,
  SAFEGUARD: 20,
  NO_CRIT: 21,
  ION_DELUGE: 22,
  FIRE_GRASS_PLEDGE: 23,
  WATER_FIRE_PLEDGE: 24,
  GRASS_WATER_PLEDGE: 25,
  FAIRY_LOCK: 26,
  DELAYED_ATTACK: 27,
  G_MAX_VINE_LASH: 28,
  G_MAX_WILDFIRE: 29,
  G_MAX_CANNONADE: 30,
  G_MAX_VOLCALITH: 31,
  SHARP_STEEL: 32,
  PENDING_HEAL: 33,
} as const;

export type ArenaTagType = ObjectValues<typeof ArenaTagType>;
