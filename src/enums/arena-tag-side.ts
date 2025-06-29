import type { EnumValues } from "#types/enum-values";

export const ArenaTagSide = {
  BOTH: 1,
  PLAYER: 2,
  ENEMY: 3,
} as const;

export type ArenaTagSide = EnumValues<typeof ArenaTagSide>;
