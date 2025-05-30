export const ArenaTagSide = {
  BOTH: 1,
  PLAYER: 2,
  ENEMY: 3,
} as const;

export type ArenaTagSide = (typeof ArenaTagSide)[keyof typeof ArenaTagSide];
