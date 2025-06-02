export const AchvTier = {
  COMMON: 1,
  GREAT: 2,
  ULTRA: 3,
  EPIC: 4,
  MASTER: 5,
} as const;

export type AchvTier = (typeof AchvTier)[keyof typeof AchvTier];
