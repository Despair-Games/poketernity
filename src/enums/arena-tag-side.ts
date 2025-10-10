import type { ObjectValues } from "#types/utility-types";

export const ArenaTagSide = {
  BOTH: 1,
  PLAYER: 2,
  ENEMY: 3,
} as const;

export type ArenaTagSide = ObjectValues<typeof ArenaTagSide>;
