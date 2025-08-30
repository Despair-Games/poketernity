import { MoveId } from "#enums/move-id";

/** An array of all tera {@linkcode MoveId | MoveIds}. */
export const TERA_MOVES = Object.freeze([MoveId.TERA_BLAST, MoveId.TERA_STARSTORM]);

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
