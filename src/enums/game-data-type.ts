import type { EnumValues } from "#types/utility-types";

/**
 * enum for the game data types
 */
export const GameDataType = {
  SYSTEM: 1,
  SESSION: 2,
  SETTINGS: 3,
  TUTORIALS: 4,
  SEEN_DIALOGUES: 5,
  RUN_HISTORY: 6,
  STARTER_PREFS: 7,
} as const;

export type GameDataType = EnumValues<typeof GameDataType>;
