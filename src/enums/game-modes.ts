import type { ObjectValues } from "#types/utility-types";

export const GameModes = {
  CLASSIC: 1,
  DAILY: 3,
  CHALLENGE: 4,
} as const;

export type GameModes = ObjectValues<typeof GameModes>;
