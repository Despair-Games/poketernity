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

/** Moves that can only be learned with a memory-mushroom */
export const RELEARN_MOVE = -1;

/**
 * Moves that are learned by applying a specific form change without requiring a high enough level. \
 * This has the same value as {@linkcode EVOLVE_MOVE}, but is provided for better clarity.
 */
export const FORM_CHANGE_MOVE = 0;

/** Moves that are learned by evolving into the indicated species */
export const EVOLVE_MOVE = 0;
