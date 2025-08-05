import type { EnumValues } from "#types/utility-types";

export const GameModes = {
  CLASSIC: 1,
  ENDLESS: 2,
  DAILY: 3,
  CHALLENGE: 4,
} as const;

export type GameModes = EnumValues<typeof GameModes>;
