import { MoveId } from "#enums/move-id";

/** An array of all tera {@linkcode MoveId | MoveIds}. */
export const TERA_MOVES = Object.freeze([MoveId.TERA_BLAST, MoveId.TERA_STARSTORM]);

/** An array of all pledge {@linkcode MoveId | MoveIds}. */
export const PLEDGE_MOVES = Object.freeze([MoveId.GRASS_PLEDGE, MoveId.FIRE_PLEDGE, MoveId.WATER_PLEDGE]);

/** An array of all sacrificial {@linkcode MoveId | MoveIds}. */
export const SACRIFICIAL_MOVES = Object.freeze([
  MoveId.SELF_DESTRUCT,
  MoveId.EXPLOSION,
  MoveId.MEMENTO,
  MoveId.FINAL_GAMBIT,
  MoveId.MISTY_EXPLOSION,
  MoveId.HEALING_WISH,
  MoveId.LUNAR_DANCE,
]);

/** An array containing the {@linkcode MoveId | MoveIds} for all variations of the move Protect */
export const PROTECT_MOVES = Object.freeze([
  MoveId.PROTECT,
  MoveId.DETECT,
  MoveId.ENDURE,
  MoveId.SPIKY_SHIELD,
  MoveId.KINGS_SHIELD,
  MoveId.BANEFUL_BUNKER,
  MoveId.OBSTRUCT,
  MoveId.BURNING_BULWARK,
  MoveId.SILK_TRAP,
]);

/** An array containing the {@linkcode MoveId | MoveIds} for all Status moves that set hazards */
export const HAZARD_STATUS_MOVES = Object.freeze([
  MoveId.SPIKES,
  MoveId.TOXIC_SPIKES,
  MoveId.STEALTH_ROCK,
  MoveId.STICKY_WEB,
]);
