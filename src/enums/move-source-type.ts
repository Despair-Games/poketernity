import type { EnumValues } from "#types/utility-types";

/**
 * Used for challenge types that modify movesets, these denote the various sources of moves for pokemon.
 */
export const MoveSourceType = {
  LEVEL_UP: 1, // Currently unimplemented for move access
  RELEARNER: 2, // Relearner moves currently unimplemented
  COMMON_TM: 3,
  GREAT_TM: 4,
  ULTRA_TM: 5,
  COMMON_EGG: 6,
  RARE_EGG: 7,
} as const;

export type MoveSourceType = EnumValues<typeof MoveSourceType>;
