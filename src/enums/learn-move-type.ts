import type { EnumValues } from "#types/utility-types";

export const LearnMoveType = {
  /** For learning a move via level-up, evolution, or other non-item-based event */
  LEARN_MOVE: 1,
  /** For learning a move via Memory Mushroom */
  MEMORY: 2,
  /** For learning a move via TM */
  TM: 3,
} as const;

export type LearnMoveType = EnumValues<typeof LearnMoveType>;
