import { ArenaTagType } from "#enums/arena-tag-type";

export const WeakenMoveTypeArenaTagTypes = Object.freeze([ArenaTagType.MUD_SPORT, ArenaTagType.WATER_SPORT]);

export const EntryHazardArenaTagTypes = Object.freeze([
  ArenaTagType.SPIKES,
  ArenaTagType.TOXIC_SPIKES,
  ArenaTagType.STEALTH_ROCK,
  ArenaTagType.SHARP_STEEL,
  ArenaTagType.STICKY_WEB,
]);

export const WeakenMoveScreenArenaTagTypes = Object.freeze([
  ArenaTagType.REFLECT,
  ArenaTagType.AURORA_VEIL,
  ArenaTagType.LIGHT_SCREEN,
]);

export const ConditionalProtectArenaTagTypes = Object.freeze([
  ArenaTagType.QUICK_GUARD,
  ArenaTagType.WIDE_GUARD,
  ArenaTagType.MAT_BLOCK,
  ArenaTagType.CRAFTY_SHIELD,
]);
